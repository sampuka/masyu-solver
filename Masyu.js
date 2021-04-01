"use strict";

const FaceType = Object.freeze({"blank":1, "white":2, "black":3});
const VertexSide = Object.freeze({"out":1, "in":2});
const EdgeValue = Object.freeze({"unknown":1, "line":2, "cross":3});

class Masyu
{
    constructor(width, height, fillinfo)
    {
        this.width = width;
        this.height = height;

        if (this.width < 1 || this.height < 1)
        {
            throw "Too small Masyu";
        }

        if (arguments.length == 2)
        {
            fillinfo = "";
        }

        fillinfo = fillinfo.toLowerCase();

        this.face_count = this.width*this.height;
        this.vertex_count = (this.width+1)*(this.height+1);
        this.hoz_edge_count = this.width*(this.height+1);
        this.ver_edge_count = this.height*(this.width+1);
        this.edge_count = this.hoz_edge_count + this.ver_edge_count;

        this.faces = new Array(this.face_count);
        for (let f = 0; f < this.face_count; f++)
        {
            this.faces[f] = {};
            this.faces[f].line_number = 0; // Face initialize to be part of no line
            this.faces[f].type = FaceType.blank; // Faces initialize to blank face
        }

        this.vertices = new Array(this.vertex_count);
        for (let v = 0; v < this.vertex_count; v++)
        {
            this.vertices[v] = {};
            this.vertices[v].group = v; // Vertices initialize to be part of its own group
            this.vertices[v].side = VertexSide.out; // Vertices initialize to be of 'outside' value
        }

        this.hoz_edges = new Array(this.hoz_edge_count);
        for (let e = 0; e < this.hoz_edge_count; e++)
        {
            this.hoz_edges[e] = {};
            this.hoz_edges[e].value = EdgeValue.unknown; // Edges initialize to unknown value
        }

        this.ver_edges = new Array(this.ver_edge_count);
        for (let e = 0; e < this.ver_edge_count; e++)
        {
            this.ver_edges[e] = {};
            this.ver_edges[e].value = EdgeValue.unknown; // Edges initialize to unknown value
        }

        if (fillinfo != "")
        {
            let fos = fillinfo.split("/");

            for (let fi = 0; fi < fos[0].length; fi++) // Faces
            {
                let c = fos[0][fi];

                if (c == 'w')
                {
                    this.faces[fi].type = FaceType.white;
                }

                if (c == 'b')
                {
                    this.faces[fi].type = FaceType.black;
                }
            }

            for (let vi = 0; vi < fos[1].length; vi++) // Faces
            {
                let c = fos[1][vi];

                if (c == 'i')
                {
                    this.vertices[vi].side = VertexSide.in;
                }

                if (c == 'o')
                {
                    this.vertices[vi].side = FaceType.out;
                }
            }

            for (let ei = 0; ei < fos[2].length; ei++) // Faces
            {
                let c = fos[2][ei];

                if (c == 'l')
                {
                    if (ei < this.hoz_edge_count)
                    {
                        this.hoz_edges[ei].value = EdgeValue.line;
                    }
                    else
                    {
                        this.ver_edges[ei-this.hoz_edge_count].value = EdgeValue.line;
                    }
                }

                if (c == 'c')
                {
                    if (ei < this.hoz_edge_count)
                    {
                        this.hoz_edges[ei].value = EdgeValue.cross;
                    }
                    else
                    {
                        this.ver_edges[ei-this.hoz_edge_count].value = EdgeValue.cross;
                    }
                }
            }
        }

        /*
        for (let x = 0; x < this.width; x++)
        {
            this.set_edge_below(x, -1, EdgeValue.cross);
            this.set_edge_below(x, this.height-1, EdgeValue.cross);
        }

        for (let y = 0; y < this.height; y++)
        {
            this.set_edge_right(-1, y, EdgeValue.cross);
            this.set_edge_right(this.width-1, y, EdgeValue.cross);
        }
        */
    }

    set_face(x, y, face_type)
    {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
        {
            console.log("Out-of-bounds in set_face!");
        }
        else
        {
            this.faces[x + y*this.width].type = face_type;
        }
    }

    set_edge_right(x, y, edge_value)
    {
        this.ver_edges[x + y*(this.width+1)+1].value = edge_value;
    }

    set_edge_below(x, y, edge_value)
    {
        this.hoz_edges[x + (y+1)*this.width].value = edge_value;
    }

    draw_on(canvas)
    {
        // Set size
        canvas.set_size(this.width, this.height);

        // Clear
        canvas.draw_grid();

        // Draw faces
        for (let f = 0; f < this.face_count; f++)
        {
            let x = f%this.width;
            let y = Math.floor(f/this.width);

            if (this.faces[f].type == FaceType.white)
            {
                canvas.draw_white(x, y);
            }

            if (this.faces[f].type == FaceType.black)
            {
                canvas.draw_black(x, y);
            }
        }

        // Draw horizontal edges
        for (let e = 0; e < this.hoz_edge_count; e++)
        {
            let x = e%this.width;
            let y = Math.floor(e/this.width)-1;

            if (this.hoz_edges[e].value == EdgeValue.line)
            {
                canvas.draw_edge_line_below(x,y);
            }

            if (this.hoz_edges[e].value == EdgeValue.cross)
            {
                canvas.draw_edge_cross_below(x,y);
            }
        }

        // Draw vertical edges
        for (let e = 0; e < this.ver_edge_count; e++)
        {
            let x = e%(this.width+1)-1;
            let y = Math.floor(e/(this.width+1));
            //console.log(String(x) + " " + String(y) + " " + String(e));

            if (this.ver_edges[e].value == EdgeValue.line)
            {
                canvas.draw_edge_line_right(x,y);
            }

            if (this.ver_edges[e].value == EdgeValue.cross)
            {
                canvas.draw_edge_cross_right(x,y);
            }
        }
    }
}
