function posting(){
    $('#proses_posting').addClass('disabled');
    var tot_posting = tot_simpanan + tot_pinjaman;
    var temp = {
        act : "posting",
        user : iduser,
        cabang : $('#cabang').val(),
        pasar : $('#pasar').val(),
        TOKEN : token
    }
    
    $.ajax({
        url: site+"/API/posting/",
        method: "POST",
        data: JSON.stringify(temp),
        success: function(result){
            if(result[0].RESULT == '1'){
                token = result[0].TOKEN_BARU;
                
                printPosting(result[0].TOKEN_LAMA);
                // previewPosting(result[0].TOKEN_LAMA);
                
                alert('sukses');
            } else if(result[0].RESULT == '2') {
                alert("gagal");
            } else {
                alert("tidak diketahui");
            }
        }
    })
}

function printPosting(token){
    $.ajax({
        url: site+"/API/print/"+token+"/",
        method: "GET",
        success: function(result){
            var dt = new Date();
            var yr = dt.getFullYear();
            var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
            var dy = ('00'+dt.getDate()).slice(-2);
            var hr = ('00'+dt.getHours()).slice(-2);
            var mn = ('00'+dt.getMinutes()).slice(-2);
            var sc = ('00'+dt.getSeconds()).slice(-2);
            var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
            
            var cetakan = 'Berhasil';
            var head_unik = "{left}-{br}";
            var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
            var separator = "--------------------------------{br}";
            var separator_unik = "-- -------------------------- --{br}";
            // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
            
            var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + result[0].ID_USER + "{br}NO        : " + result[0].NO_TRANSAKSI + "{br}TANGGAL   : " + result[0].TANGGAL.replace(/\-/g, '/') + "{br}JML TRX   : " + result.length + "{br}TOT SIMP  : " + parseInt(result[0].SIMPANAN).toLocaleString("id-ID") + "{br}TOT SETOR : " + parseInt(result[0].TOTAL).toLocaleString("id-ID") + "{br}PASAR     : " + result[0].nama_pasar + "{br}";
            var jeni = "{left}  CIF       NOREK      NOMINAL  {br}";
            var thanks = "{center}- Terima Kasih -{br}";
            var eol = "{br}{br}{br}";
            
            var jeni_detil = '';
            var c = '1000000000';
            for(var i = 0; i < result.length; i++){
                jeni_detil += result[i].NO_ANGGOTA + "  " + result[i].ID_SIMPANAN + "  " + lpad(parseInt(result[i].NOMINAL).toLocaleString("id-ID"), 10, ' ') + "{br}";
            }
            
            cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
            // console.log(cetakan);
            
            window.DatecsPrinter.listBluetoothDevices(function (devices) {
                window.DatecsPrinter.connect(devices[0].address, function() {
                    window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
                        app.toast.create({
                            text: "Posting Harian Berhasil",
                            closeTimeout: 3000,
                            closeButton: true
                        }).open();
                        app.views.main.router.navigate('/cif/');
                    }, function() {
                        alert("Gagal Mencetak, Proses Dibatalkan");
                        // alert(JSON.stringify(error));
                    });
                    // printBayar(q);
                },
                function() {
                    alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
                    // alert(JSON.stringify(error));
                });
            },
            function (error) {
                // alert(JSON.stringify(error));
            });
        }
    })
}

function printUlang(token){
    $.ajax({
        url: site+"/API/print/"+token+"/",
        method: "GET",
        success: function(result){
            var dt = new Date();
            var yr = dt.getFullYear();
            var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
            var dy = ('00'+dt.getDate()).slice(-2);
            var hr = ('00'+dt.getHours()).slice(-2);
            var mn = ('00'+dt.getMinutes()).slice(-2);
            var sc = ('00'+dt.getSeconds()).slice(-2);
            var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
            
            var cetakan = 'Berhasil';
            var head_unik = "{left}-{br}";
            var kop = "{br}{center}PT BPR BANK SLEMAN (PERSERODA){br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
            var separator = "--------------------------------{br}";
            var separator_unik = "-- -------------------------- --{br}";
            // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";
            
            var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + result[0].ID_USER + "{br}NO        : " + result[0].NO_TRANSAKSI + "{br}TANGGAL   : " + result[0].TANGGAL.replace(/\-/g, '/') + "{br}JML TRX   : " + result.length + "{br}TOT SIMP  : " + parseInt(result[0].SIMPANAN).toLocaleString("id-ID") + "{br}TOT SETOR : " + parseInt(result[0].TOTAL).toLocaleString("id-ID") + "{br}PASAR     : " + result[0].nama_pasar + "{br}";
            var jeni = "{left}  CIF       NOREK      NOMINAL  {br}";
            var thanks = "{center}- Terima Kasih -{br}";
            var eol = "{br}{br}{br}";
            
            var jeni_detil = '';
            var c = '1000000000';
            for(var i = 0; i < result.length; i++){
                jeni_detil += result[i].NO_ANGGOTA + "  " + result[i].ID_SIMPANAN + "  " + lpad(parseInt(result[i].NOMINAL).toLocaleString("id-ID"), 10, ' ') + "{br}";
            }
            
            cetakan = head_unik + kop + separator + post + separator + jeni + jeni_detil + separator_unik + thanks + eol;
            // console.log(cetakan);
            
            window.DatecsPrinter.listBluetoothDevices(function (devices) {
                window.DatecsPrinter.connect(devices[0].address, function() {
                    window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
                        app.toast.create({
                            text: "Print Ulang Berhasil",
                            closeTimeout: 3000,
                            closeButton: true
                        }).open();
                    }, function() {
                        alert("Gagal Mencetak, Proses Dibatalkan");
                        // alert(JSON.stringify(error));
                    });
                    // printBayar(q);
                },
                function() {
                    alert("Tidak Dapat Tersambung Ke Printer, Proses Dibatalkan");
                    // alert(JSON.stringify(error));
                });
            },
            function (error) {
                // alert(JSON.stringify(error));
            });
        }
    })
}