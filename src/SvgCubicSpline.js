import React, { Component } from 'react';
import CubicSpline from './CubicSpline';

class SvgCubicSpline extends Component {
    constructor(props)
    {
        super();
        this.pointRadius = 1;
        this.points = props.points;

        this.spline = new CubicSpline();
        this.spline.setKnotsFromPoints(this.points);
    }

    createDot(x)
    {
        var y = this.spline.interpolateY(x);
        return (<circle id="point" cx={x} cy={y} r={this.pointRadius} />);
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
        <svg id="idSvg" width="800" height="800">
            <g stroke="black" stroke-width="3" fill="black">
            {this.getElements()}
            </g>
        </svg>);
    }
}

export default SvgCubicSpline;