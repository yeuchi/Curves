/*
 * COMB
 * http://www.aliasworkbench.com/theoryBuilders/TB5_evaluate1.htm
 *
 * 1. Curvature (height) = 1 / radius (a proportional value)
 * 2. radius = intersection of 2 tangent lines
 * 3. tangent line = tangent of a point on the spline curve.
 * 4. point on spline curve = calculated or knot value.
 */

import Point from './Point';
import Line from './Line';

 class COMB
 {
    constructor(knots)
    {
        this._knots = knots;
    }

    getNormalByIndex(index)
    {
        if(typeof(this._normals)==="undefined" ||
            null === this._normals ||
            index < 0 || index > this._normals.length)
            return null;

        return this._normals[index];
    }

    calculateOrthogonals()
    {
        if (typeof(this._knots)==="undefined" ||
            null ===this._knots ||
            0===this._knots.length)
            return false;

        this._normals = [];
        var line = null;
        var end = this._knots.length-1;
        for(var i=0; i<= end; i++)
        {
            var normal = null;
            switch(i)
            {
                case 0:
                line = new Line(this._knots[0], this._knots[1])
                normal = this.findNormalOnLine(line, line.pointStart);
                break;

                case end:
                line = new Line(this._knots[end-1], this._knots[end])
                normal = this.findNormalOnLine(line, line.pointStart);
                break;

                default:
                normal = this.findNormalProjection(this._knots[i-1], this._knots[i], this._knots[i+1]);
                break;
            }

            // orthogonal normal line
            this._normals.push(normal);
        }
    }

    /*
     * find normal line on spline line directly (start, end)
     */
    findNormalOnLine(line,    // line to be normal from 
                    point)    // point on line to extend normal
    {
        
    }

    /*
     * find normal line by projection (between start, end)
     */
    findNormalProjection(p0,    // left
                         p,     // projection point
                         p1)    // right
    {
        // find line representing knot
        var dis = p.distanceFromPoint(p0);
        var line = new Line(p, p1);
        var pp = line.findPointOnLineBetweenPoints(dis);
        
        // find normal of line -- projection
        line = new Line(p0, pp);
        var normal = line.findTangentThroughPoint(p);

        // find appropriate start 'p' + end point p -> distance 1/radius
    }

    /*
     * 1. Curvature (height) = 1 / radius (a proportional value)
     * 2. radius = intersection of 2 tangent lines
     */
    findRadius()
    {

    }
 }

 export default COMB;