class MasyuCanvas
{
    constructor()
    {
        this.cv = document.querySelector("canvas");
        this.cx = this.cv.getContext("2d");

        // Grid style
        this.border_thickness = 4;
        this.border_margin = 5;
        this.grid_offset = this.border_thickness + this.border_margin;
        this.edge_thickness = 1;
        this.face_size = 40;

        // Element style
        this.circle_radius = this.face_size/2-6;
        this.line_thickness = 4;
        this.cross_radius = 3;

        this.set_size(10, 10); // Just default, will probably be set from outside immediately after construction
    }

    set_size(width, height)
    {
        this.width = width;
        this.height = height;
        this.pixel_width = this.grid_offset*2 + (width+1)*this.edge_thickness + width*this.face_size;
        this.pixel_height = this.grid_offset*2 + (height+1)*this.edge_thickness + height*this.face_size;

        this.cv.width = this.pixel_width;
        this.cv.height = this.pixel_height;
    }

    draw_grid()
    {
        // Shorthand helper variables
        let bt = this.border_thickness;
        let go = this.grid_offset;
        let et = this.edge_thickness;
        let fs = this.face_size;

        // Erase canvas
        this.cx.fillStyle = "white";
        this.cx.fillRect(0, 0, this.pixel_width, this.pixel_height);

        // Draw border
        this.cx.strokeStyle = "black";
        this.cx.lineWidth = bt;
        this.cx.strokeRect(bt/2, bt/2, this.pixel_width-bt, this.pixel_height-bt);

        // Draw vertical edges
        this.cx.fillStyle = "black";
        for (let w = 0; w < this.width+1; w++)
        {
            this.cx.fillRect(go + w*(et+fs), go, et, (this.height+1)*et + this.height*fs);
        }

        // Draw horizontal edges
        this.cx.fillStyle = "black";
        for (let h = 0; h < this.height+1; h++)
        {
            this.cx.fillRect(go, go + h*(et+fs), (this.width+1)*et + this.width*fs, et);
        }
    }

    draw_white(x, y) // Zero-indexed
    {
        this.cx.lineWidth = 1;
        this.cx.strokeStyle = "black";
        this.cx.beginPath();
        this.cx.arc(
            this.grid_offset + (x+1)*this.edge_thickness + (x+0.5)*this.face_size,
            this.grid_offset + (y+1)*this.edge_thickness + (y+0.5)*this.face_size,
            this.circle_radius,
            0, 2*Math.PI);
        this.cx.stroke();
    }

    draw_black(x, y) // Zero-indexed
    {
        this.cx.fillStyle = "black";
        this.cx.beginPath();
        this.cx.arc(
            this.grid_offset + (x+1)*this.edge_thickness + (x+0.5)*this.face_size,
            this.grid_offset + (y+1)*this.edge_thickness + (y+0.5)*this.face_size,
            this.circle_radius,
            0, 2*Math.PI);
        this.cx.fill();
    }

    draw_edge_line_right(x, y)
    {
        let xp = this.grid_offset + (x+1)*this.edge_thickness + (x+0.5)*this.face_size;
        let yp = this.grid_offset + (y+1)*this.edge_thickness + (y+0.5)*this.face_size;
        this.cx.fillStyle = "black";
        this.cx.fillRect(
            xp - this.line_thickness/2,
            yp - this.line_thickness/2,
            this.face_size + this.edge_thickness + this.line_thickness,
            this.line_thickness);
    }

    draw_edge_line_below(x, y)
    {
        let xp = this.grid_offset + (x+1)*this.edge_thickness + (x+0.5)*this.face_size;
        let yp = this.grid_offset + (y+1)*this.edge_thickness + (y+0.5)*this.face_size;
        this.cx.fillStyle = "black";
        this.cx.fillRect(
            xp - this.line_thickness/2,
            yp - this.line_thickness/2,
            this.line_thickness,
            this.face_size + this.edge_thickness + this.line_thickness);
    }

    draw_edge_cross_right(x, y)
    {
        this.cx.fillStyle = "black";
        this.cx.beginPath();
        this.cx.arc(
            this.grid_offset + (x+1.5)*this.edge_thickness + (x+1)*this.face_size,
            this.grid_offset + (y+1.5)*this.edge_thickness + (y+0.5)*this.face_size,
            this.cross_radius,
            0, 2*Math.PI);
        this.cx.fill();
    }

    draw_edge_cross_below(x, y)
    {
        this.cx.fillStyle = "black";
        this.cx.beginPath();
        this.cx.arc(
            this.grid_offset + (x+1.5)*this.edge_thickness + (x+0.5)*this.face_size,
            this.grid_offset + (y+1.5)*this.edge_thickness + (y+1)*this.face_size,
            this.cross_radius,
            0, 2*Math.PI);
        this.cx.fill();
    }
}
