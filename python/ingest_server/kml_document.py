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
            xmlStyle("no-activity", "FFFFFFFF"),
            xmlStyle("site-prep", "FFFFFFFF"),
            xmlStyle("active-construction", "00ff0033"),
            xmlStyle("post-construction", "FFFFFFFF"),
            xmlStyle("unknown", "FFFFFFFF"),
            xmlStyle("boundary", "FFFFFFFF"),
        ]

    def _header(self):
        lat = self.center[1]
        lng = self.center[0]
        try:
            date = self.polygons[0].startDate
        except:
            date = datetime.now().strftime('%Y-%m-%d') 
        return HEADER.format(lat=lat, lng=lng, date=date)

    def _footer(self):
        return FOOTER

    def add_polygon(self,poly):
        self.polygons.append(poly)
    
    def set_center(self,center):
        self.center = center

    def export(self):
        output = self._header()
        for style in self.styles:
            output += style
        boundary = Polygon(
            "Boundary",
            self.outline,
            '1900-01-01',
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
            output += poly.export(next)
        output += self._footer()
        return output


class Polygon():
    def __init__(self, name, points, startDate, style):
        self.points = points
        self.startDate = startDate  # "2019-03-15"
        self.name = name
        self.style = style

    def export(self,next_poly=None):
        if (next_poly is None):
            endDate = datetime.now().strftime('%Y-%m-%d')
        else:
            endDate = next_poly.startDate
            endDate = datetime.fromisoformat(endDate) - timedelta(days=1)
            endDate = endDate.strftime('%Y-%m-%d')
        return POLYGON.format(
            startDate = self.startDate,
            endDate = endDate,
            name = self.name,
            style= self.style,
            coordinates = pointsToCoordinates(self.points)
        )

def pointsToCoordinates(points):
        coords= list(map(lambda x: f'{x[0]},{x[1]}', points))
        return " ".join(coords)