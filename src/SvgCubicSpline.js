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

    createLine(x0, x1)
    {

    }

    createDot(x, radius)
    {
        var y = this.spline.interpolateY(x);
        return (<circle id="point" cx={x} cy={y} r={radius} />);
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

        if(typeof(this.svgBound)=="undefined")
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

        // create a dot for every x position
        this.dots2Draw = [];        
        for(var x=minX; x<maxX; x++)
            this.dots2Draw.push(this.createDot(x, 1));

        // create knot elements
        this.knots2Draw = [];
        var radius = 3;
        for(var i=0; i<this.spline.arySrcX.length; i++)
        {
            var x = this.spline.arySrcX[i];
            var y = this.spline.arySrcY[i];
            this.knots2Draw.push(<circle id="point" cx={x} cy={y} r={radius} />)
        }
    }

    getCurveDots()
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
            {this.getCurveDots()}
            {this.getCurveKnots()}
        </svg>);
    }
}

export default SvgCubicSpline;