/*
 * Module:      Line Segment
 *
 * Description: a line
 */


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

    get Slope() {
        this._m = (this._pEnd.y - this._pStart.y) / (this._pEnd.x - this._pStart.x)
        return this._m;
    }
}
