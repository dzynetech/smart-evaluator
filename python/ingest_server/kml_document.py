import re
from kml import *
from datetime import datetime, timedelta

def xmlStyle(name, colorRGBA):
    colorABGR = re.findall('..', colorRGBA)
    colorABGR.reverse()
    colorABGR = ''.join(colorABGR)
    return STYLE.format(name=name, color=colorABGR)

class KMLDocument():
    def __init__(self):
        self.center = None
        self.outline = None #should be array of points [lng,lat]
        self.polygons = []
        self.styles = [
            xmlStyle("no-activity", "2f4f4fdd"),
            xmlStyle("site-prep", "6666e1dd"),
            xmlStyle("active-construction", "00ff00dd"),
            xmlStyle("post-construction", "ffa500dd"),
            xmlStyle("unknown", "dddddddd"),
            xmlStyle("boundary", "ff0000dd"),
        ]

    def _header(self,name="untitled"):
        lat = self.center[1]
        lng = self.center[0]
        try:
            date = self.polygons[0].startDate
        except:
            date = datetime.now().strftime('%Y-%m-%d') 
        return HEADER.format(name=name,lat=lat, lng=lng, date=date)

    def _footer(self):
        return FOOTER

    def add_polygon(self,poly):
        self.polygons.append(poly)
    
    def set_center(self,center):
        self.center = center

    def export(self,name):
        output = self._header(name)
        for style in self.styles:
            output += style
        boundary = Polygon(
            "Boundary",
            self.outline,
            None,
            'boundary'
        )
        # import pdb; pdb.set_trace()
        output += boundary.export()
        for i in range(len(self.polygons)):
            poly = self.polygons[i]
            try:
                next = self.polygons[i+1]
            except:
                next = None
            output += poly.export(next,date_name=True)
        output += self._footer()
        return output


class Polygon():
    def __init__(self, name, points, startDate, style):
        self.points = points
        self.startDate = startDate  # "2019-03-15"
        self.name = name
        self.style = style

    def export(self,next_poly=None, date_name=False):
        name = self.name
        if date_name:
            name =f"{self.name}: {self.startDate}"
        if self.startDate is None:
            return POLYGON.format(
                name = name,
                style= self.style,
                coordinates = pointsToCoordinates(self.points)
            )
        if next_poly is None:
            endDate = datetime.now().strftime('%Y-%m-%d')
        else:
            endDate = next_poly.startDate
            endDate = datetime.fromisoformat(endDate) - timedelta(days=1)
            endDate = endDate.strftime('%Y-%m-%d')
        return POLYGON_TIMESPAN.format(
            startDate = self.startDate,
            endDate = endDate,
            name = name,
            style= self.style,
            coordinates = pointsToCoordinates(self.points)
        )

def pointsToCoordinates(points):
        coords= list(map(lambda x: f'{x[0]},{x[1]}', points))
        return " ".join(coords)