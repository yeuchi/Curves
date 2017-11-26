import React, { Component } from 'react';
import Point from './Point';
import CubicSpline from './CubicSpline';

class SvgCubicSpline extends Component {
    constructor(props)
    {
        super();
        this.state = null;
        this.pointRadius = 1;
        this.points = props.points;

        this.spline = new CubicSpline();
        this.spline.setKnotsFromPoints(this.points);

        //this.clickHandler = this.clickHandler.bind(this);
    }

    createDot(x)
    {
        var y = this.spline.interpolateY(x);
        return (<circle id="point" cx={x} cy={y} r={this.pointRadius} />);
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
        // need to re-render !
        
        this.forceUpdate();
      }

    /*
     * get SVG path elements that make up spline
     */
    getElements()
    {
        /*
         * consider these examples
         * https://www.w3schools.com/graphics/svg_path.asp
         */
        if(!this.spline.hasKnots)
            return null;

        var minX = this.spline.minX;
        var maxX = this.spline.maxX;
        var dots2Draw = [];
        this.spline.formulate();

        // use map instead ?
        for(var x=minX; x<maxX; x++)
            dots2Draw.push(this.createDot(x));
        
        return dots2Draw;
    }

    render() {
        return (
        <svg id="idSvg" width="800" height="800" onClick={this.clickHandler.bind(this)}>
            <g stroke="black" strokeWidth="1" fill="black">
            {this.getElements()}
            </g>
        </svg>);
    }
}

export default SvgCubicSpline;