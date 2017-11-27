import React, { Component } from 'react';
import Point from './Point';
import CubicSpline from './CubicSpline';

class SvgCubicSpline extends Component {
    constructor(props)
    {
        super();
        this.state = null;
        this.points = props.points;

        this.spline = new CubicSpline();
        this.spline.setKnotsFromPoints(this.points);

        //this.clickHandler = this.clickHandler.bind(this);
    }

    getSvgBound()
    {
        this.svg = document.getElementById('idSvg');
        if(null!=this.svg)
            this.svgBound = this.svg.getBoundingClientRect();
    }

    clickHandler(e)
    {
        if(typeof(this.svg)==="undefined")
            this.getSvgBound();

        if(typeof(this.svgBound)==="undefined")
            return;

        var pos = new Point(e.clientX-this.svgBound.left, e.clientY-this.svgBound.top);
        this.spline.append(pos);
        this.forceUpdate();
      }

    /*
     * get SVG path elements that make up spline
     */
    createElements()
    {
        /*
         * consider these examples
         * https://www.w3schools.com/graphics/svg_path.asp
         */
        if(!this.spline.hasKnots)
            return null;

        var minX = this.spline.minX;
        var maxX = this.spline.maxX;
        this.spline.formulate();

        this.interpolate(minX, maxX);       // interpolate all points on curve
        this.createKnots(minX, maxX);       // create svg knots elements
        this.createPieceswise(minX, maxX);  // create piecewise segments
    }

    createKnots(minX, maxX)
    {
        // create a dot for each knot 
        this.knots2Draw = [];
        for(var i=0; i<this.spline.arySrcX.length; i++)
        {
            var x = this.spline.arySrcX[i];
            var y = this.spline.arySrcY[i];
            this.knots2Draw.push(this.createDot(x, y, 3));
        }
    }

    interpolate(minX, maxX)
    {
        // create a dot for every x position
        this.dots2Draw = [];        
        this.curveY = [];
        for(var x=minX; x<maxX; x++)
        {
            var y = this.spline.interpolateY(x);
            this.curveY.push(y);
        }
    }

    createDot(x, y, radius)
    {
        return (<circle id="point" cx={x} cy={y} r={radius} />);
    }

    slopeRMS(slope0, slope1)
    {
        var s = slope1 - slope0;
        var rms = Math.sqrt(s*s);
        return rms;
    }

    createPieceswise(minX, maxX)
    {
        // draw lines - can be optimized 
        var slope0 = null;
        var p0 = null;
        var p1 = null;
        this.lines2Draw = [];
        var len = this.curveY.length-1;
        for(var i=0; i<len; i++)
        {
            // calculate slope
            var slope1 = (this.curveY[i+1]-this.curveY[i]);
            p1 = new Point(i+minX, this.curveY[i]);
            
            if(null===slope0)
            {
                // new line
                p0 = p1;
                slope0 = slope1;
            }
            else
            {
                // when slope changes
                if(this.slopeRMS(slope0, slope1)>0.1)
                {
                    this.lines2Draw.push(this.createLine(p0, p1));
                    this.dots2Draw.push(this.createDot(p1.x, p1.y, 2));
                    
                    slope0 = null;
                    p0 = null;
                }
            }
        }
        // last line segment
        this.lines2Draw.push(this.createLine(p0, new Point(maxX, this.curveY[len])));
    }

    createLine(p0, p1)
    {
        return (<line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y}/>);
    }

    getLines()
    {
        return (<g stroke="green" strokeWidth="1">
                {this.lines2Draw}
                </g>);
    }

    getLineDots()
    {
        return (<g stroke="black" strokeWidth="0" fill="black">
                {this.dots2Draw}
                </g>);
    }

    getCurveKnots()
    {
        return (<g stroke="red" strokeWidth="1" fill="red">
        {this.knots2Draw}
        </g>);
    }

    render() {
        this.createElements();
        
        return (
        <svg id="idSvg" width="800" height="800" onClick={this.clickHandler.bind(this)}>
            {this.getLines()}        
            {this.getLineDots()}
            {this.getCurveKnots()}
        </svg>);
    }
}

export default SvgCubicSpline;