
HEADER = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
    <name>template</name>
    <open>1</open>
    <LookAt>
        <longitude>{lng}</longitude>
        <latitude>{lat}</latitude>
        <heading>0</heading>
        <tilt>0</tilt>
        <range>900</range>
        <gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>
        <gx:TimeStamp>
            <when>{date}</when>
        </gx:TimeStamp>
        <gx:ViewerOptions>
            <gx:option name="historicalimagery"></gx:option>
            <gx:option enabled="0" name="sunlight"></gx:option>
            <gx:option enabled="0" name="streetview"></gx:option>
        </gx:ViewerOptions>
    </LookAt>
"""
FOOTER = """
</Document>
</kml>
"""

STYLE = """
    <Style id="{name}">
        <LineStyle>
            <color>{color}</color>
            <width>4</width>
        </LineStyle>
        <PolyStyle>
            <fill>0</fill>
        </PolyStyle>
    </Style>
"""


POLYGON = """
	<Placemark>
		<TimeSpan>
			<begin>{startDate}</begin>
			<end>{endDate}</end>
		</TimeSpan>
		<name>{name}</name>
		<styleUrl>#{style}</styleUrl>
		<Polygon>
			<tessellate>1</tessellate>
			<outerBoundaryIs>
				<LinearRing>
					<coordinates>
						{coordinates}
					</coordinates>
				</LinearRing>
			</outerBoundaryIs>
		</Polygon>
	</Placemark>
"""