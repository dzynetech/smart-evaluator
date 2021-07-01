from os import truncate
import psycopg2
from geocodio import GeocodioClient, client
import json
import time
import signal

API_KEY = "d1310b9b9eb7d5916bbd6443d66d0be7e7d4034"
geocode_rate = 10  # per minute
connection = None
bad_permit_ids = []


def main():
	global connection
	geocode_client = GeocodioClient(API_KEY)
	connection = psycopg2.connect(user="postgres",
                               password="postgres",
                               host="postgres",
                               port="5432",
                               database="smart")

	while True:
		updated_permit = geocode_permit(geocode_client)
		if (updated_permit == False):
			# all permits have lat/lon, don't check for at least a minute
			time.sleep(60)
		time.sleep(60/geocode_rate)


def geocode_permit(geocode_client):
	global connection
	cursor = connection.cursor()
	# create source in db
	sql = 'SELECT id,street_number, street, city, state FROM "permits" where location is NULL '
	for permit_id in bad_permit_ids:
		sql += f"AND NOT id={permit_id} "
	sql += "limit 1"
	cursor.execute(sql)
	permit_info = cursor.fetchone()
	if (permit_info is None):
		# no permits need geocoding
		return False
	id = permit_info[0]
	address = None
	try:
		address = " ".join(permit_info[1:])
		print(f"Getting Address for permit {id}: {address}")
	except:
		print(f"Permit {id} has no address. ")
		bad_permit_ids.append(id)
		return

	# use geocode API, get 2500 free requests per day
	response = geocode_client.geocode(address)
	formatted_addr = response['results'][0]['formatted_address']
	print("Found: " + formatted_addr)
	loc = response['results'][0]['location']
	acc = response['results'][0]['accuracy'] * 100
	acc_type = response['results'][0]['accuracy_type']
	print(f"Coord: ({loc['lat']}, {loc['lng']}) with accuracy: {acc}% {acc_type}")

	# sanitize lat and lng as they are injected into sql string directly
	try:
		lat = float(loc['lat'])
		lng = float(loc['lng'])
	except:
		print("WARN: lat or lng was not a float. Geocode API is acting weird. Refusing to write to database")
		return

	# update database
	sql = f"UPDATE public.permits SET location=ST_GeomFromText('POINT({lng} {lat})')"
	sql += ", formatted_address = %s, geocode_data= %s where id=%s"

	cursor.execute(sql, (formatted_addr, json.dumps(response), id))
	connection.commit()
	cursor.close()
	return True


def on_container_stop():
	# not sure if this actually does anything
	connection.close()


signal.signal(signal.SIGINT, on_container_stop)
if __name__ == '__main__':
	main()
