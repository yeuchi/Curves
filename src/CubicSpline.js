// ============================================================================
// Module:		CubicSpline.js
//
// Description:	2D Cubic Spline interpolation in javascript as defined by reference.
//				
// Reference:	Numerical Recipes in C 2nd Edition, Press, Teukolsky, Vetterling, Flannery, pg.113
//			
// Authors:		William H. Press
//				William T. Vetterling
//				Saul A. Teukolsky
//				Brian P. Flannery
//
//				C.T. Yeung (porting from C into javascript)
//
// Input:		pSrcX - array of anchors' x (assume positive real numbers)
//				pSrcY - array of anchors' y (assume positive real numbers)
//
// Output:		getY(x) => returns interpolated Y value.
//
// WARNING:     must invoke formulate() after all knots are added before getY(x)
//
// History:	
// 20Nov11		ported it to javascript, working in HTML5 canvas.			cty
// 12Nov17      upgrade to ECMAScript6                                      cty
// ============================================================================
import Point from './Point';

class CubicSpline
{
    constructor()
    {
        this.init();
    }

    /*
     * instantiate all arrays (knots + intermediate)
     */
    init() {
        this.arySrcX = [];
        this.arySrcY = [];
        this.initIntermediate();
    }

    /*
     * instantiate intermediate arrays
     */
    initIntermediate()
    {
        this.aryB = [];
        this.aryC = [];
        this.aryD = [];
        this.aryH = [];
        this.arySIG = [];
        this.aryL = [];
        this.aryU = [];
        this.aryZ = [];
    }

    /*
     * are we empty or not
     */
    hasKnots()
    {
        return (this.arySrcX.length>0)? true:false;
    }

    /*
     * number of knots
     */
    get numKnots() {
        return this.arySrcX.length;
    }

    get minX() {
        if(null===this.arySrcX || this.arySrcX.length===0)
            return null;

        return this.arySrcX[0];
    }

    get maxX() {
        if(null===this.arySrcX || this.arySrcX.length===0)
        return null;

        return this.arySrcX[this.arySrcX.length-1];
    }

    /*
     * is i a valid index into arySrcX or arySrcY ?
     * - check valid integer, not real number
     */
    isValidKnotsIndex(i)
    {
        var isInt = (i % 1 === 0);
        if(false === isInt)
            return false;

        return this.arySrcX.length>i && i>=0;
    }

    /*
     * add 1 knot point
     * return: true / false;
     */
    append(point) {
        
        if(typeof(point) === "undefined" ||
           null===point)
           return false;

        if(!this.hasKnots() ||
           point.x > this.arySrcX[this.arySrcX.length-1])
        {
            this.arySrcX.push(point.x);
            this.arySrcY.push(point.y);
            return true;
        }
        else 
        {
            /*
             * consider points prior to start 
             * and points after end
             */
            var index = this.bisection(point.x) + 1;
            this.arySrcX.splice(index, 0, point.x);
            this.arySrcY.splice(index, 0, point.y);
            return true;
        }
        // never reach here
        //return false;
    }

    /*
     * remove n knots 
     * - use append() for addition feature of splice
     */
    splice(index,           // index of operation
           removeCount) {   // number of knots to remove

        if(false===this.isValidKnotsIndex(index) ||              // valid input ?
           false===this.hasKnots())                              // have content ?
            return false;

        if(removeCount < 0 ||                                   // valid input ?
           false===this.isValidKnotsIndex(index+removeCount) )   // valid index ?
            return false;

        this.arySrcX.splice(index, removeCount);
        this.arySrcY.splice(index, removeCount);
        return true;
    }

    /*
     * replace population with sub-set
     */
    slice(start, end) {
        if(start > end ||                                 // valid order
            (false === this.isValidKnotsIndex(end) &&     // valid end index
            false === this.isValidKnotsIndex(start)))     // valid start index
            return false;

        this.arySrcX = this.arySrcX.slice(start, end);    
        this.arySrcY = this.arySrcY.slice(start, end);    
        return true;
    }
	
	setKnotsFromArrays(arrayX, arrayY)
	{
		if(typeof(arrayX) === "undefined" ||
            null==arrayX)
            return false;

		if(typeof(arrayY) === "undefined" ||
            null==arrayY)
            return false;
		
		if(arrayX.length !== arrayY.length ||
		   arrayX.length === 0)
			return false;
		
        this.arySrcX = arrayX;
        this.arySrcY = arrayY;
		return true;
	}

    /*
     * set all knots from points
     */
    setKnotsFromPoints(arrayOfPoints) {
        if(typeof(arrayOfPoints) === "undefined" ||
            null==arrayOfPoints)
            return false;

        this.arySrcX = [];
        this.arySrcY = [];
        for(var i=0; i<arrayOfPoints.length; i++)
        {
			var p = arrayOfPoints[i];
            this.arySrcX.push(p.x);
			this.arySrcY.push(p.y);
        }
		return true;
    }

    /*
     * return all knots
     */
    get knots() {
        var arrayOfPoints = [];
        for(var i=0; i<this.numKnots; i++)
        {
            arrayOfPoints.push(new Point(this.arySrcX[i], this.arySrcY[i]));
        }
        return arrayOfPoints;
    }

    /*
     * remove all knots
     */
    clear() {
        this.init();
    }
                        
    /*
     * create all intermediate values prior calculations
     * 
     * RETURN: true / false				
     */
    formulate() { 							

        if(!this.hasKnots())
            return false;
        
        this.initIntermediate();
        
        // Theorem 3.11		[A].[x] = [b]					[A] -> n x n Matrix
        //													[b] -> n x n Matrix
        //													[x] -> c[] 0..n
        //	STEP 1		eq. 4 (pg. 134)
        for (var aa = 0; aa < this.numKnots-1; aa ++)
            this.aryH[aa] = this.arySrcX[aa+1] - this.arySrcX[aa];			// [A], Hj = Xj+1 - Xj

        // STEP 2
        for (aa = 1; aa < this.numKnots-1; aa ++)			// 0 -> n-1
            this.arySIG[aa] = (3.0/this.aryH[aa] * (this.arySrcY[aa+1] - this.arySrcY[aa])) - 
                                (3.0/this.aryH[aa-1] * (this.arySrcY[aa] - this.arySrcY[aa-1]));
        
        // STEP 3
        this.aryL[0] = 0;
        this.aryU[0] = 0;
        this.aryZ[0] = 0;

        // STEP 4
        for (aa = 1; aa < this.numKnots-1; aa ++)
        {
            this.aryL[aa] = (2.0 * (this.arySrcX[aa+1] - this.arySrcX[aa-1])) - (this.aryH[aa-1] * this.aryU[aa-1]);
            this.aryU[aa] = this.aryH[aa] / this.aryL[aa];
            this.aryZ[aa] = (this.arySIG[aa] - (this.aryH[aa-1] * this.aryZ[aa-1])) / this.aryL[aa];
        }
        
        // STEP 5		TAIL BOUNDARY @ 0
        this.aryL[this.numKnots-1] = 1;
        this.aryZ[this.numKnots-1] = 0;
        this.aryC[this.numKnots-1] = 0;
        
        // STEP 6
        for (aa = this.numKnots-2; aa >= 0; aa --)
        {
            this.aryC[aa] = this.aryZ[aa] - (this.aryU[aa] * this.aryC[aa+1]);					// Theorem 3.11
            this.aryB[aa] = (this.arySrcY[aa+1] - this.arySrcY[aa]) / this.aryH[aa] 
                        - (this.aryH[aa] * (this.aryC[aa+1] + 2 * this.aryC[aa]) / 3);		// eq. 10
            this.aryD[aa] = (this.aryC[aa+1] - this.aryC[aa]) / (3 * this.aryH[aa]);			// eq. 11
        }
    }

    /*
     * Get the y-axis value from the cubic spline function
     * RETURN: y (real-number) value for x-coordinate (real-value)
     */
    interpolateY(x) {                   // input x (real-number)
        var index = this.bisection(x);
        
        if(this.arySrcX[index] === x)
            return this.arySrcY[index];
        else
            return this.doCubicSpline(x, index);
    }

    /*
     * bisection search to locate x-axis values for input
     * - intended as a private method
     */
    bisection(ab) {                                                             // x-axis value
        var ju = this.numKnots-1;											    // upper limit
        var jl = 0;															    // lower limit
        var jm;																    // midpoint

        while (ju - jl > 1)							
        {
            jm = Math.round((ju + jl)/2);									// midpoint formula

            if (ab > this.arySrcX[jm])
                jl = jm;
            else
                ju = jm;
        }
        return jl;		
    }

    /*
     * calculate the y value
     * - intended to be a private method
     * WARNING: must have invoked formulate() before this.
     * RETURN: -1 if invalid, positive value if ok.
     */
    doCubicSpline(x, 				// [in] x value
                  index) {			// [in] index of anchor to use
        var Y;
        
        Y = this.arySrcY[index]									    + 
        this.aryB[index] *	(x - this.arySrcX[index])				+
        this.aryC[index] *	Math.pow((x - this.arySrcX[index]), 2) 	+
        this.aryD[index] * Math.pow((x - this.arySrcX[index]), 3);
        return Y;
    }
}

export default CubicSpline;