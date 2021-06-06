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
            this.faces[f].line_number = 9999999; // Face initialize to be part of no line
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

            if (fos.length > 3)
            {
                console.log("Bad fillstring, too long!");
                fos.length = 3;
            }

            while (fos.length < 3)
            {
                fos.push("");
            }

            for (let fi = 0; fi < fos[0].length; fi++) // Faces
            {
                let c = fos[0][fi];

                if (c == 'w')
                {
                    this.faces[fi].type = FaceType.white;
                    this.faces[fi].line_number = fi;
                }

                if (c == 'b')
                {
                    this.faces[fi].type = FaceType.black;
                    this.faces[fi].line_number = fi;
                }
            }

            for (let vi = 0; vi < fos[1].length; vi++) // Vertices
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

            for (let ei = 0; ei < fos[2].length; ei++) // Edges
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
    }

    segment_count()
    {
        let s = new Set();
        for (let n = 0; n < this.face_count; n++)
        {
            s.add(this.faces[n].line_number);
        }
        return s.size;
    }

    initialize_borders()
    {
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
    }

    index_xy(n)
    {
        return [n%this.width, Math.floor(n/this.width)];
    }

    index_n(x, y)
    {
        return y*this.width + x;
    }

    update_state()
    {
        let changed = true;

        while (changed)
        {
            changed = false;
            for (let n = 0; n < this.face_count; n++)
            {
                let [x,y] = this.index_xy(n);
                let num = this.faces[n].line_number;

                if (this.get_edge_below(x,y-1) == EdgeValue.line)
                {
                    let num2 = this.faces[this.index_n(x,y-1)].line_number;
                    if (num2 < num)
                    {
                        this.faces[n].line_number = num2;
                        changed = true;
                    }
                    else if (num2 > num)
                    {
                        this.faces[this.index_n(x,y-1)].line_number = num;
                        changed = true;
                    }
                }

                if (this.get_edge_below(x,y) == EdgeValue.line)
                {
                    let num2 = this.faces[this.index_n(x,y+1)].line_number;
                    if (num2 < num)
                    {
                        this.faces[n].line_number = num2;
                        changed = true;
                    }
                    else if (num2 > num)
                    {
                        this.faces[this.index_n(x,y+1)].line_number = num;
                        changed = true;
                    }
                }

                if (this.get_edge_right(x-1,y) == EdgeValue.line)
                {
                    let num2 = this.faces[this.index_n(x-1,y)].line_number;
                    if (num2 < num)
                    {
                        this.faces[n].line_number = num2;
                        changed = true;
                    }
                    else if (num2 > num)
                    {
                        this.faces[this.index_n(x-1,y)].line_number = num;
                        changed = true;
                    }
                }

                if (this.get_edge_right(x,y) == EdgeValue.line)
                {
                    let num2 = this.faces[this.index_n(x+1,y)].line_number;
                    if (num2 < num)
                    {
                        this.faces[n].line_number = num2;
                        changed = true;
                    }
                    else if (num2 > num)
                    {
                        this.faces[this.index_n(x+1,y)].line_number = num;
                        changed = true;
                    }
                }
            }
        }

        return true;
    }

    solve_step()
    {
        // Propagate blocks
        if (this.find_pattern(1, 1, "./..../ccc.", "./..../cccc"))
        {
            return true;
        }
        if (this.find_pattern(1, 1, "./..../ll..", "./..../llcc"))
        {
            return true;
        }
        if (this.find_pattern(1, 1, "./..../l.l.", "./..../lclc"))
        {
            return true;
        }

        // Resolve line end
        if (this.find_pattern(1, 1, "./..../c.lc", "./..../cllc"))
        {
            return true;
        }
        if (this.find_pattern(1, 1, "./..../ccl.", "./..../ccll"))
        {
            return true;
        }

        // Avoid loop
        if (this.segment_count() > 2)
        {
            for (let x = 0; x < this.width-1; x++)
            {
                for (let y = 0; y < this.height; y++)
                {
                    if (this.get_edge_right(x, y) == EdgeValue.unknown &&
                        this.faces[this.index_n(x,y)].line_number != 9999999 &&
                        this.faces[this.index_n(x,y)].line_number == this.faces[this.index_n(x+1,y)].line_number)
                    {
                        this.set_edge_right(x, y, EdgeValue.cross);
                        return true;
                    }
                }
            }

            for (let x = 0; x < this.width; x++)
            {
                for (let y = 0; y < this.height-1; y++)
                {
                    if (this.get_edge_below(x, y) == EdgeValue.unknown &&
                        this.faces[this.index_n(x,y)].line_number != 9999999 &&
                        this.faces[this.index_n(x,y)].line_number == this.faces[this.index_n(x,y+1)].line_number)
                    {
                        this.set_edge_below(x, y, EdgeValue.cross);
                        return true;
                    }
                }
            }
        }

        // White block
        if (this.find_pattern(1, 1, "w/..../c...", "w/..../ccll"))
        {
            return true;
        }

        // White continuation
        if (this.find_pattern(1, 1, "w/..../l...", "w/..../ll.."))
        {
            return true;
        }

        // Black block
        if (this.find_pattern(3, 1, "b../......../......c...", "b../......../.c..c.cll."))
        {
            return true;
        }
        if (this.find_pattern(4, 1, ".b../........../l............", ".b../........../l.c...c..cll."))
        {
            return true;
        }
        if (this.find_pattern(4, 1, ".b../........../........c....", ".b../........../........ccll."))
        {
            return true;
        }

        // Black continuation
        if (this.find_pattern(3, 1, "b../......../.......l..", "b../......../.c..c.cll."))
        {
            return true;
        }

        // White hook
        if (this.find_pattern(3, 1, ".w./......../.......lll", ".w./......../......clll"))
        {
            return true;
        }

        // Triplet white
        if (this.find_pattern(3, 1, "www/......../..........", "www/......../llllll...."))
        {
            return true;
        }

        // White pointer
        if (this.find_pattern(3, 1, ".ww/......../......l...", ".ww/......../.ll.lllccc"))
        {
            return true;
        }

        // White pincer
        if (this.find_pattern(3, 1, ".w./......../......l..l", ".w./......../.l..l.lccl"))
        {
            return true;
        }

        return false;
    }

    find_pattern(w, h, fillinfo1, fillinfo2)
    {
        let pattern = new Masyu(w, h, fillinfo1);
        let res = new Masyu(w, h, fillinfo2);

        for (let r = 0; r < 8; r++)
        {
            if (r > 0)
            {
                pattern.rotate();
                res.rotate();
            }

            if (r == 4)
            {
                pattern.flip();
                res.flip();
            }

            for (let x = 0; x < this.width-pattern.width+1; x++)
            {
                for (let y = 0; y < this.height-pattern.height+1; y++)
                {
                    if (this.match_pattern(pattern, x, y) && !this.match_pattern(res, x, y))
                    {
                        this.insert_pattern(res, x, y);
                        console.log("Performed pattern at (" + String(x) + "," + String(y) + ")");
                        return true;
                    }
                }
            }
        }

        return false;
    }

    match_pattern(p, x, y)
    {
        let match_success = true;

        for (let px = 0; px < p.width && match_success; px++)
        {
            for (let py = 0; py < p.height && match_success; py++)
            {
                if (p.get_face(px, py) != FaceType.blank)
                {
                    if (p.get_face(px, py) != this.get_face(px+x, py+y))
                    {
                        match_success = false;
                    }
                }
            }
        }

        for (let px = 0; px < p.width && match_success; px++)
        {
            for (let py = -1; py < p.height && match_success; py++)
            {
                if (p.get_edge_below(px, py) != EdgeValue.unknown)
                {
                    if (p.get_edge_below(px, py) != this.get_edge_below(px+x, py+y))
                    {
                        match_success = false;
                    }
                }
            }
        }

        for (let px = -1; px < p.width && match_success; px++)
        {
            for (let py = 0; py < p.height && match_success; py++)
            {
                if (p.get_edge_right(px, py) != EdgeValue.unknown)
                {
                    if (p.get_edge_right(px, py) != this.get_edge_right(px+x, py+y))
                    {
                        match_success = false;
                    }
                }
            }
        }

        return match_success;
    }

    insert_pattern(p, x, y)
    {
        for (let px = 0; px < p.width; px++)
        {
            for (let py = 0; py < p.height; py++)
            {
                let f = p.get_face(px, py);
                if (f != FaceType.blank)
                {
                    this.set_face(x+px, y+py, f);
                }
            }
        }

        for (let px = 0; px < p.width; px++)
        {
            for (let py = -1; py < p.height; py++)
            {
                let e = p.get_edge_below(px, py);
                if (e != EdgeValue.unknown)
                {
                    this.set_edge_below(x+px, y+py, e);
                }
            }
        }

        for (let px = -1; px < p.width; px++)
        {
            for (let py = 0; py < p.height; py++)
            {
                let e = p.get_edge_right(px, py);
                if (e != EdgeValue.unknown)
                {
                    this.set_edge_right(x+px, y+py, e);
                }
            }
        }
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

    get_face(x, y)
    {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
        {
            console.log("Out-of-bounds in get_face! (" + String(x) + "," + String(y) + ")");
            return FaceType.blank;
        }
        else
        {
            return this.faces[x + y*this.width].type;
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

    get_edge_right(x, y)
    {
        return this.ver_edges[x + y*(this.width+1)+1].value;
    }

    get_edge_below(x, y)
    {
        return this.hoz_edges[x + (y+1)*this.width].value;
    }

    rotate()
    {
        let pre = _.cloneDeep(this);

        this.height = pre.width;
        this.width = pre.height;

        this.hoz_edge_count = this.width*(this.height+1);
        this.ver_edge_count = this.height*(this.width+1);

        this.hoz_edges = _.cloneDeep(pre.ver_edges);
        this.ver_edges = _.cloneDeep(pre.hoz_edges);

        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                this.set_face(x, y, pre.get_face(y, pre.height-x-1));
            }
        }

        for (let x = 0; x < this.width; x++)
        {
            for (let y = -1; y < this.height; y++)
            {
                this.set_edge_below(x, y, pre.get_edge_right(y, pre.height-x-1));
            }
        }

        for (let x = -1; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                //console.log(String(y) + "," + String(pre.height-x-1));
                this.set_edge_right(x, y, pre.get_edge_below(y, pre.height-x-2));
            }
        }
    }

    flip()
    {
        let pre = _.cloneDeep(this);

        for (let x = 0; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                this.set_face(x, y, pre.get_face(x, pre.height-y-1));
            }
        }

        for (let x = 0; x < this.width; x++)
        {
            for (let y = -1; y < this.height; y++)
            {
                //console.log(String(x) + "," + String(pre.height-y+1));
                this.set_edge_below(x, y, pre.get_edge_below(x, pre.height-y-2));
            }
        }

        for (let x = -1; x < this.width; x++)
        {
            for (let y = 0; y < this.height; y++)
            {
                //console.log(String(y) + "," + String(pre.height-x-1));
                this.set_edge_right(x, y, pre.get_edge_right(x, pre.height-y-1));
            }
        }
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
