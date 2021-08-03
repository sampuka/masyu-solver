//let ms = new Masyu(8, 7, ".w....w..b.bb.b....................ww....b....b.........");
let ms = new Masyu(15, 15, "...w....bwb.....w...b.....b..ww...w..w..w....w.ww..............b.w....w..b....w..ww.w..w.w.....ww.ww.w....wwb.b...w.........b...w...b...w.......w...ww...b...ww......b.....ww..w...b.w....w...w..w....b..w........b.......w..ww..");
//let ms = new Masyu(6, 3, "......w....w....w.");
let cc = new MasyuCanvas("solver_masyu_canvas");
ms.initialize_borders();
ms.update_state();
ms.draw_on(cc);

let axi_steps = ["ProBl", "ExtLn", "WhiCl", "BlkCl", "AvdSl"];

let esy_steps = ["TwnBl", "TrpWh", "WhiPt", "WhiPc"];

let med_steps = ["VtxPr"];

let all_steps = axi_steps.concat(esy_steps.concat(med_steps));

//while(ms.solve_step() && ms.update_state())
//    ms.draw_on(cc);

function take_step()
{
    clear_table_styles();

    let copy = _.cloneDeep(ms);
    for (let i = 0; i < all_steps.length; i++)
    {
        let step_name = all_steps[i];
        let tr = document.getElementById(step_name);
        let chk = tr.children[0].children[0];
        let txt = tr.children[1];

        if (chk.checked)
        {
            if (copy["step_" + step_name]())
            {
                ms = copy;
                txt.style.backgroundColor = "#88FF88";
                break;
            }
            else
            {
                txt.style.backgroundColor = "#FF8888";
            }
        }
    }

    ms.update_state();
    ms.draw_on(cc);
}

function take_big_step()
{
    clear_table_styles();

    let found_axi = false;
    let updated = true;

    let copy = _.cloneDeep(ms);
    while (updated)
    {
        updated = false;
        for (let i = 0; i < axi_steps.length; i++)
        {
            let step_name = axi_steps[i];
            let tr = document.getElementById(step_name);
            let chk = tr.children[0].children[0];
            let txt = tr.children[1];

            if (chk.checked)
            {
                if (copy["step_" + step_name]())
                {
                    txt.style.backgroundColor = "#88FF88";
                    found_axi = true;
                    updated = true;
                    copy.update_state();
                    break;
                }
            }
        }
    }

    if (found_axi)
    {
        ms = copy;
        ms.update_state();
        ms.draw_on(cc);
    }
    else
    {
        take_step();
    }
}

function clear_table_styles()
{
    for (let i = 0; i < all_steps.length; i++)
    {
        let step_name = all_steps[i];
        let tr = document.getElementById(step_name);
        let txt = tr.children[1];

        txt.style.backgroundColor = "";
    }

}

fill_pattern("propagate_blocks", 1, 1, "./..../cc.c", "./..../cccc");

fill_pattern("resolve_line_end_a", 1, 1, "./..../ccl.", "./..../ccll");
fill_pattern("resolve_line_end_b", 1, 1, "./..../c.lc", "./..../cllc");

fill_pattern("block_branches_a", 1, 1, "./..../..ll", "./..../ccll");
fill_pattern("block_branches_b", 1, 1, "./..../.ll.", "./..../cllc");

fill_pattern("white_block", 1, 1, "w/..../c...", "w/..../ccll");

fill_pattern("white_line", 1, 1, "w/..../..l.", "w/..../ccll");

function fill_pattern(pattern_name, w, h, fillinfo1, fillinfo2)
{
    let div_id = "pattern_" + pattern_name;
    let div_ele = document.getElementById(div_id);

    let c1 = document.createElement("canvas");
    let c2 = document.createElement("canvas");
    c1.id = div_id + "_1";
    c2.id = div_id + "_2";

    let arrow = document.createElement("p");
    arrow.text = "->";

    div_ele.appendChild(c1);
    //div_ele.appendChild(arrow);
    div_ele.appendChild(c2);

    let cc1 = new MasyuCanvas(c1.id);
    let ms1 = new Masyu(w, h, fillinfo1);
    ms1.draw_on(cc1)

    let cc2 = new MasyuCanvas(c2.id);
    let ms2 = new Masyu(w, h, fillinfo2);
    ms2.draw_on(cc2)
}
