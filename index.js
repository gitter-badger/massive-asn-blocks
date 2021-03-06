#! /usr/bin/env node

/* @source: https://github.com/carloscarvallo/massive-asn-blocks
   Copyright (C) 2015-2016  Carlos Carvallo

The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source. */

const scrap = require('./src/ipinfo-scrap'),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync,
notice = clc.blue,
proc = process.argv;

scrap.asn(function (page) {
    proc.map(function(item, i, array) {
        if (i === 0 && item.indexOf("node") !== -1) {
            array.splice(0, 1);
        }
    });
    scrap.block(page, function (data) {
        var args = [];
        proc.map(function(item, i) {
            if ( i >= 2 ) {
                args.push(item);
            }
        });
        data.map(function(item, i, array) {
             var netblock = data[i][0], numIPs = data[i][1], com = "";
             args.push(netblock+"/"+numIPs);
             console.log(notice("\n++++++++++++++++++"));
             console.log(notice(" Command executed "));
             console.log(notice("++++++++++++++++++\n"));
             for (i = 2; i < proc.length; i++) {
                 if (i > 2) { com += " "+proc[i]; }
                 else { com += proc[i]; }
             }
             if (proc.length == 2) { console.log(notice(proc[1], netblock+"/"+numIPs)+"\n"); }
             else { console.log(notice(proc[1], com+" "+netblock+"/"+numIPs)+"\n"); }
             spawnSync(proc[1], args, {stdio:[0,1,2]});
        });
    });
});
