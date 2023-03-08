import re
from kml import *
from datetime import datetime


def xmlStyle(name, colorRGBA):
    colorABGR = re.findall('..', colorRGBA)
    colorABGR.reverse()
    colorABGR = ''.join(colorABGR)
    return STYLE.format(name=name, color=colorABGR)


class KMLDocument():
    def __init__(self):
        self.outline_polygon = None
        self.polygons = []
        self.styles = [
            xmlStyle("No Activity", "FFFFFFFF"),
            xmlStyle("Site Preparation", "FFFFFFFF"),
            xmlStyle("Active Construction", "00ff0033"),
            xmlStyle("Post Construction", "FFFFFFFF"),
            xmlStyle("Unknown", "FFFFFFFF"),
        ]

    def _header(self):
        lat = 30
        lng = -72
        date = self.polygons[0].startDate
        return HEADER.format(lat=lat, lng=lng, date=date)

    def _footer(self):
        return FOOTER

    def add_polygon(self,poly):
        self.polygons.append(poly)

    def export(self):
        output = self._header()
        for style in self.styles:
            output += style
        for polygon in self.polygons:
            output += polygon.export()
        output += self._footer()
        return output


class Polygon():
    def __init__(self, name, points, startDate, endDate, style):
        self.points = points
        self.startDate = startDate  # "2019-03-15"
        self.endDate = endDate
        if (self.endDate is None):
            self.endDate = datetime.now().strftime('%Y-%m-%d')
        self.name = name,
        self.style = style

    def export(self):
        coords= list(map(lambda x: f'{x[0]},{x[1]}', self.points))
        import pdb; pdb.set_trace()
        return POLYGON.format(
            startDate = self.startDate,
            endDate = self.endDate,
            name = self.name,
            style= self.style,
            coordinates = " ".join(coords)
        )
