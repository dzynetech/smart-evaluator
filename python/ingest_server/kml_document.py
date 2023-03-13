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
        self.startDate=None
        self.endDate=None
        self.polygons = []
        self.styles = [
            xmlStyle("no-activity", "999999dd"),
            xmlStyle("site-prep", "00ff00dd"),
            xmlStyle("active-construction", "ff0000dd"),
            xmlStyle("post-construction", "ffa500dd"),
            xmlStyle("unknown", "dddddddd"),
            xmlStyle("boundary", "ffff00dd"),
        ]

    def _header(self,name="untitled"):
        lat = self.center[1]
        lng = self.center[0]
        try:
            date = self.boundary.startDate
        except:
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
        output += self.boundary.export()
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
    def __init__(self, name, points, startDate, style, endDate=None):
        self.points = points
        self.startDate = startDate  # "2019-03-15"
        self.name = name
        self.style = style
        self.endDate = endDate

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
        if self.endDate is None:
            if next_poly is None:
                self.endDate = datetime.now().strftime('%Y-%m-%d')
            else:
                self.endDate = next_poly.startDate
                self.endDate = datetime.fromisoformat(self.endDate) - timedelta(days=1)
                self.endDate = self.endDate.strftime('%Y-%m-%d')
        return POLYGON_TIMESPAN.format(
            startDate = self.startDate,
            endDate = self.endDate,
            name = name,
            style= self.style,
            coordinates = pointsToCoordinates(self.points)
        )

def pointsToCoordinates(points):
        coords= list(map(lambda x: f'{x[0]},{x[1]}', points))
        return " ".join(coords)