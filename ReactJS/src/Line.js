/*
 * Module:      Line Segment
 *
 * Description: a line
 */

import React, { Component } from 'react';
import Point from './Point';

class Line {

    constructor(pointStart, pointEnd)
    {
        this._pStart = pointStart;
        this._pEnd = pointEnd;
    }

    get pointStart()
    {
        return this._pStart;
    }

    get pointEnd()
    {
        return this._pEnd;
    }

    /*
     * find point between start -> end 
     * measure distance from start
     */
    findPointOnLineBetweenPoints(distance)
    {
    }

    /*
     * find point away from end point + distance.
     * - not in between start -> end
     */
    findPointOnLineAwayEnd(distance)
    {

    }
    
    /*
     * find tangent line from input point
     *
     * input:
     * - point
     * 
     * output:
     * - tangent line object
     */
    findTangentThroughPoint(point,      // start point of line 
                            distance)   // find end point on tangent line
    {
        // tangent line's slope
        var tm = 1 / this._m;

        // find y intercept m = (y2 - y1) / (x2 - x1)
        var y = point.y - tm * point.x;
        var line = new Line(point, new Point(0, y));

        var p = line.findPointOnLineAwayEnd(distance);

        // consider about direction (between start + end point)
        line = new Line(point, p);
        return line;
    }

    /*
     * find y-intercept point
     */ 
    get Yintercept()
    {
        this._m = (this._pEnd.y - this._pStart.y)/(this._pEnd.x - this._pStart.x);
        var y = this._pEnd.y - this._m * this._pEnd.x;
        return new Point(0, y);
    }
    
    /*
     * find intersection with another line
     *
     * input:
     * - line
     *
     * output:
     * - point of intersection
     */
    pointIntersectLine(line)
    {
        
    }
}

export default Line;