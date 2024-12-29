
class Point
{
    constructor(x, y)
    {
        this._x = x;
        this._y = y;
    }
    
    distanceFromPoint(point)
    {
        return this.distanceFromXY(point.x, point.y);
    }
    
    distanceFromXY(x,y)
    {
        var xx = this._x - x;
        xx = xx * xx;
        
        var yy = this._y - y;
        yy = yy * yy;
        
        return Math.sqrt(xx+yy);
    }
    
    get x()
    {
       return this._x; 
    }
    
    get y()
    {
        return this._y;
    }
    
    set x(x)
    {
        this._x = x;
    }
    
    set y(y)
    {
        this._y = y;
    }
}
