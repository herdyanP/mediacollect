function cekCIF(src, cif){
    var tabel = '';
    var dt1 = '';
    if(cif != ''){
        $.ajax({
            url: site+'/API/CIF/'+cif+'/',
            method: 'GET',
            success: function(result){
            tabel = 
            '<table style="width: 100%; padding-left: 16px;">\
                <tr>\
                    <td colspan="3" style="text-align: left;"><b>Informasi Nasabah</b></td>\
                </tr>\
                <tr>\
                    <td width="15%"><b>CIF</b></td>\
                    <td width="5%"><b>:</b></td>\
                    <td width="80%"><b>'+result[0].CIF+'</b></td>\
                </tr>\
                <tr>\
                    <td width="15%"><b>Nama</b></td>\
                    <td width="5%"><b>:</b></td>\
                    <td width="80%"><b>'+result[0].SSNAMA+'</b></td>\
                </tr>\
                <tr>\
                    <td width="15%"><b>Alamat</b></td>\
                    <td width="5%"><b>:</b></td>\
                    <td width="80%"><b>'+result[0].SSALAMAT+'</b></td>\
                </tr>\
            </table>';
    
            switch(src){
                // case "cif":
                //   dt1 = '<table>\
                //       <thead>\
                //         <tr>\
                //           <th class="label-cell">Rekening</th>\
                //           <th >Produk</th>\
                //           <th class="numeric-cell">Saldo</th>\
                //         </tr>\
                //       </thead>\
                //       <tbody>\
                //   ';
    
                //   for(var i = 0; i < result.length; i++){
                //     dt1 += '<tr>\
                //               <td class="label-cell">'+result[i].SSREK+'</td>\
                //               <td >'+result[i].jpinjaman+'</td>\
                //               <td class="numeric-cell">'+parseInt(result[i].saldo).toLocaleString('id-ID')+'</th>\
                //             </tr>\
                //     ';
                //   }
    
                //   dt1 += '</tbody>\
                //         </table>\
                //     ';
    
                //   $('#rekening_cif').html(dt1);
                //   $('#detil_cif').html(tabel);
                //   break;
    
                case "coll_s":
                dt1 = '<table style="width: 100%">\
                    <thead>\
                        <th style="width: 20%;" class="label-cell"><b>Rekening</b></th>\
                        <th style="width: 30%;"><b>Nama Produk</b></th>\
                        <th style="width: 20%;" class="numeric-cell"><b>Saldo Sekarang</b></th>\
                        <th style="width: 10%;"><b>Update Terakhir</b></th>\
                        <th style="width: 10%;"><b>Status</th>\
                        <th style="width: 10%;"></th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                ';
    
                var back1 = "#e6ecf2";
                var back2 = "#ffffff";
    
                for(var i = 0; i < result.length; i++){
                    dt1 += '<tr style="background: ' +(i % 2 == 0? back1 : back2)+ '; border-left: solid black 2px; border-right: solid black 2px;">\
                            <td style="width: 20%;" class="label-cell"><b>'+result[i].SSREK+'</b></td>\
                            <td style="width: 30%;"><b>'+result[i].jpinjaman+'</b></td>\
                            <td style="width: 20%;" class="numeric-cell"><b>'+parseInt(result[i].saldo).toLocaleString('id-ID')+'</b></th>\
                            <td style="width: 10%;"><b>'+result[i].SSTGL+'</b></td>\
                            <td style="width: 10%;"><b>'+(result[i].STATUS == 'A' || result[i].STATUS == 'Y' ? 'Aktif' : 'Pasif')+'</b></td>\
                            <td style="width: 10%;" ><a onclick="proses(\'simpanan\', \''+result[i].CIF+'\', \''+result[i].SSREK+'\', \''+result[i].SSNAMA+'\', \''+result[i].saldo+'\', '+result[i].LIMIT+')">Proses</a></td>\
                            </tr>\
                    ';
                }
    
                dt1 += '</tbody>\
                        </table>\
                    ';
    
                $('#rekening_colls').html(dt1);
                $('#detil_colls').html(tabel);
                break;
    
                // case "coll_a":
                //   $('#detil_colla').html(tabel);
                //   break;
            }
            }
        });
    }
}

function proses(jenis, cif, rek, nama, sal, limit){
    window.DatecsPrinter.listBluetoothDevices(function(devices){
        window.DatecsPrinter.connect(devices[0].address, function(){
            
            app.dialog.create({
                title: 'Setoran',
                closeByBackdropClick: false,
                content: 
                '<div class="list no-hairlines no-hairlines-between">\
                    <ul>\
                        <li class="item-content item-input">\
                            <div class="item-inner">\
                                <div class="item-input-wrap">\
                                    <input type="tel" pattern="[0-9]" name="nominal" id="nominal" oninput="comma(this)" style="text-align: right; font-size: 24px;" autocomplete="off"/>\
                                </div>\
                            </div>\
                        </li>\
                    </ul>\
                </div>',
                buttons: [{
                    text: 'Batal',
                    onClick: function(dialog, e){
                        dialog.close();
                    }
                },
                {
                    text: 'Simpan',
                    onClick: function(dialog, e){
                        var nominal = parseInt($('#nominal').val().replace(/\D/g, ''));
                        var saldo = sal.replace(/\D/g,'');
                        var newsaldo = parseInt(saldo) + parseInt(nominal);
                        var temp = {
                            act : "insert",
                            jenis_print : "setoran",
                            jenis : jenis,
                            cif : cif,
                            rek : rek,
                            nominal : nominal,
                            nama : nama,
                            user : iduser,
                            saldo : newsaldo,
                            TOKEN : token
                        }
                        
                        if(nominal + limit <= limit_harian){
                            var prel = app.dialog.preloader('Menyimpan setoran ke server...');
                            
                            $.ajax({
                                url: site+"/API/setoran/",
                                method: "POST",
                                data: JSON.stringify(temp),
                                success: function(result){
                                    prel.close();
                                    
                                    console.log(result[0].idx);
                                    if(result[0].RESULT == "1"){
                                        
                                        dialog.close();
                                        app.dialog.alert("Berhasil tersimpan", "Sukses", function(){
                                            printSetoran(result[0].idx);
                                        });
                                        
                                        
                                    } else if(result[0].RESULT == "2"){
                                        app.dialog.alert("Gagal tersimpan", "Error");
                                        
                                        window.DatecsPrinter.disconnect();
                                        
                                        dialog.close();
                                        app.views.main.router.refreshPage();
                                    } else {
                                        app.dialog.alert("Gagal tersimpan", "Error");
                                        
                                        window.DatecsPrinter.disconnect();
                                        
                                        dialog.close();
                                        app.views.main.router.refreshPage();
                                    }
                                }
                            })
                        } else {
                            app.toast.create({
                                text: "Setoran Untuk Rekening Tersebut Telah Mencapai Batas Harian. Membatalkan Proses Setoran.",
                                closeTimeout: 3000,
                                closeButton: true
                            }).open();
                            
                            window.DatecsPrinter.disconnect();
                        }
                    }
                }]
            }).open();
            
        }, function(){
            alert("Gagal tersambung ke printer");
        })
    }, function(){
        alert("Printer tidak ditemukan");
    })
}

function printSetoran(idx){
    gagal_print = idx;
    
    var prel = app.dialog.preloader('Mencetak Struk...');
    $.ajax({
        url: site+"/API/setoran/"+idx+"/",
        method: "GET",
        success: function(json){
            var result = json[0];
            var dt = new Date();
            var yr = dt.getFullYear();
            var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
            var dy = ('00'+dt.getDate()).slice(-2);
            var hr = ('00'+dt.getHours()).slice(-2);
            var mn = ('00'+dt.getMinutes()).slice(-2);
            var sc = ('00'+dt.getSeconds()).slice(-2);
            var cd = hari[dt.getDay()];
            // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
            var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
            var timestamp = hr + ":" + mn + ":" + sc;
            
            var cetakan = 'Berhasil';
            var head_unik = "{left}-{br}";
            var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
            var separator = "--------------------------------{br}";
            var separator_unik = "-- -------------------------- --{br}";
            // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
            var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";
            
            // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
            var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}JENIS    : " + result.JPINJAMAN + "{br}AMOUNT   : " + parseInt(result.NOMINAL).toLocaleString("id-ID") + "{br}SALDO    : " + parseInt(result.saldo_baru).toLocaleString("id-ID") + "{br}";
            var thanks = "{center}- Terima Kasih -{br}";
            var eol = "{br}{br}{br}";
            
            cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
            // console.log(cetakan);
            
            window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
                prel.close();
                app.dialog.alert("Berhasil Mencetak", "Sukses");
                app.views.main.router.refreshPage();
            }, function() {
                prel.close();
                app.dialog.alert("Gagal mencetak", "Error");
                app.views.main.router.refreshPage();
            });
        }
    });
    
}

function printUlangSetoran(){
    if(gagal_print){
        
        $.ajax({
            url: site+"/API/setoran/"+gagal_print+"/",
            method: "GET",
            success: function(json){
                var result = json[0];
                var dt = new Date();
                var yr = dt.getFullYear();
                var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
                var dy = ('00'+dt.getDate()).slice(-2);
                var hr = ('00'+dt.getHours()).slice(-2);
                var mn = ('00'+dt.getMinutes()).slice(-2);
                var sc = ('00'+dt.getSeconds()).slice(-2);
                var cd = hari[dt.getDay()];
                // var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
                var datestamp = cd + ", " + dy + "/" + mt + "/" + yr;
                var timestamp = hr + ":" + mn + ":" + sc;
                
                var cetakan = 'Berhasil';
                var head_unik = "{left}-{br}";
                var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
                var separator = "--------------------------------{br}";
                var separator_unik = "-- -------------------------- --{br}";
                // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
                var detil = "{left}NAMA : " + result.SSNAMA + "{br}OPR  : " + iduser + "{br}";
                
                // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
                var setor = "{left}SETOR TUNAI{br}HARI/TGL : " + datestamp + "{br}JAM      : " + timestamp + "{br}NO TRANS : " + result.NO_TRANSAKSI + "{br}REK      : " + result.ID_SIMPANAN + "{br}JENIS    : " + result.JPINJAMAN + "{br}AMOUNT   : " + parseInt(result.NOMINAL).toLocaleString("id-ID") + "{br}SALDO    : " + parseInt(result.saldo_baru).toLocaleString("id-ID") + "{br}";
                var thanks = "{center}- Terima Kasih -{br}";
                var eol = "{br}{br}{br}";
                
                cetakan = head_unik + kop + separator + detil + separator + setor + separator_unik + thanks + eol;
                // console.log(cetakan);
                // window.DatecsPrinter.listBluetoothDevices(function (devices) {
                // window.DatecsPrinter.connect(devices[0].address, function() {
                
                
                window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
                    app.toast.create({
                        text: "Cetak Ulang Receipt Setoran Berhasil",
                        closeTimeout: 3000,
                        closeButton: true
                    }).open();
                }, function() {
                    alert("Gagal Mencetak, Proses Dibatalkan");
                });
                
                // },
                // function() {
                //   alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
                
                // });
                // },
                // function (error) {
                
                // });
            }
        });
    } else {
        app.toast.create({
            text: "Belum Terjadi Proses Setoran, Tidak Ada Yang Bisa Diprint",
            closeTimeout: 3000,
            closeButton: true
        }).open();
    }
}