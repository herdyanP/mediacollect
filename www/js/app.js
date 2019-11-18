// Dom7
// sudo cordova build android --release -- --keystore=lightpos.keystore --storePassword=bismillah --alias=lightpos --password=bismillah
// C:\Program Files\Java\jre1.8.0_221\bin>keytool -genkey -v -keystore sisco.keystore -alias sisco -keyalg RSA -keysize 2048 -validity 10000

// Init App
var app = new Framework7({
  id: 'com.medianusamandiri.collectionapp',
  root: '#app',
  init: false,
  // theme: theme,
  routes: routes,
});

document.addEventListener('deviceready', function() {
  app.init();

  document.addEventListener("backbutton", onBackPressed, false);
});

var site = 'http://mcollection.cloudmnm.com';
var ac;
var iduser = '';
var tot_simpanan = 0;
var tot_pinjaman = 0;
var idx = [];
var po_simpanan = [];
var jenis_laporan = '';
var to_be_printed = '';
var to_be_previewed = '';

function onNewLogin(form){
  var temp = {};

  $.each($(form).serializeArray(), function(){
    temp[this.name] = this.value;
  })

  $.ajax({
    url: site+"/API/login/",
    data: JSON.stringify(temp),
    method: "POST",
    success: function(result){
      if(result.length > 0){
        iduser = result[0].USERNAME;
        app.views.main.router.navigate('/cif/');
      } else {
        app.toast.create({
          text: "Cek lagi username / password anda",
          closeTimeout: 3000,
          closeButton: true
        }).open();
      }
    }
  })
}

function cekCIF(src, cif){
  var tabel = '';
  var dt1 = '';
  $.ajax({
    url: site+'/API/CIF/'+cif+'/',
    method: 'GET',
    success: function(result){
      tabel = '<table style="width: 100%; padding-left: 16px;">\
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
        </table>\
      ';

      switch(src){
        case "cif":
          dt1 = '<table>\
              <thead>\
                <tr>\
                  <th class="label-cell">Rekening</th>\
                  <th >Produk</th>\
                  <th class="numeric-cell">Saldo</th>\
                </tr>\
              </thead>\
              <tbody>\
          ';

          for(var i = 0; i < result.length; i++){
            dt1 += '<tr>\
                      <td class="label-cell">'+result[i].SSREK+'</td>\
                      <td >'+result[i].jpinjaman+'</td>\
                      <td class="numeric-cell">'+parseInt(result[i].saldo).toLocaleString('id-ID')+'</th>\
                    </tr>\
            ';
          }

          dt1 += '</tbody>\
                </table>\
            ';

          $('#rekening_cif').html(dt1);
          $('#detil_cif').html(tabel);
          break;

        case "coll_s":
          dt1 = '<table>\
              <thead>\
                  <th class="label-cell">Rekening</th>\
                  <th >Produk</th>\
                  <th></th>\
                </tr>\
              </thead>\
              <tbody>\
          ';

          for(var i = 0; i < result.length; i++){
            dt1 += '<tr>\
                      <td class="label-cell">'+result[i].SSREK+'</td>\
                      <td >'+result[i].jpinjaman+'</td>\
                      <td ><a onclick="proses(\'simpanan\', \''+result[i].CIF+'\', \''+result[i].SSREK+'\', \''+result[i].SSNAMA+'\', \''+result[i].saldo+'\')">Proses</a></td>\
                    </tr>\
            ';
          }

          dt1 += '</tbody>\
                </table>\
            ';

          $('#rekening_colls').html(dt1);
          $('#detil_colls').html(tabel);
          break;

        case "coll_a":
          $('#detil_colla').html(tabel);
          break;
      }
    }
  })
}

function proses(jenis, cif, rek, nama, sal){
  app.dialog.create({
    title: 'Setoran',
    closeByBackdropClick: false,
    content: 
      '<div class="list no-hairlines no-hairlines-between">\
        <ul>\
          <li class="item-content item-input">\
            <div class="item-inner">\
              <div class="item-input-wrap">\
                <input type="tel" pattern="[0-9]" name="nominal" id="nominal" oninput="comma(this)" style="text-align: right;" autocomplete="off"/>\
              </div>\
            </div>\
          </li>\
        </ul>\
      </div>',
    buttons: [
    {
      text: 'Batal',
      onClick: function(dialog, e){
        dialog.close();
      }
    },{
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
          saldo : newsaldo
        }

        $.ajax({
          url: site+"/API/trans/setoran/",
          method: "GET",
          success: function(result){
            console.log(result.trans);
            temp.trans = result.trans;
            // console.log(temp);
            printSetoran(temp);
            // previewSetoran(temp);
            // bypassSetoran(temp);

            dialog.close();
          }
        })
      }
    }]
  }).open();
}

function previewSetoran(temp){
  to_be_printed = temp;
  var dt = new Date();
  var yr = dt.getFullYear();
  var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
  var dy = ('00'+dt.getDate()).slice(-2);
  var hr = ('00'+dt.getHours()).slice(-2);
  var mn = ('00'+dt.getMinutes()).slice(-2);
  var sc = ('00'+dt.getSeconds()).slice(-2);
  var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

  var cetakan = 'Berhasil';
  var table_head = '<table style="width: 100%;"><tr><th style="width: 45%"></th><th style="width: 10%"></th><th style="width: 45%"></th></tr>';

  var kop = '<tr><td colspan="3" style="text-align: center;">PD BPR BANK SLEMAN</td></tr><tr><td colspan="3" style="text-align: center;">Magelang KM10 Tridadi Sleman</td></tr><tr><td colspan="3" style="text-align: center;">Telp (0274)868321</td></tr>';
  // var kop = "{br}{center} PD BPR BANK SLEMAN{br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";

  var separator = '<tr><td colspan="3" style="border-top: dashed black 2px"></td></tr>';
  // var separator = "--------------------------------{br}";

  var detil = '<tr><td>CIF</td><td>:</td><td>'+temp.cif+'</td></tr><tr><td>NAMA</td><td>:</td><td>'+temp.nama+'</td></tr><tr><td>OPR</td><td>:</td><td>'+iduser+'</td></tr>';
  // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

  var setor = '<tr><td colspan="3">SETOR TUNAI</td></tr><tr><td>TANGGAL</td><td>:</td><td>'+timestamp+'</td></tr><tr><td>NO TRANS</td><td>:</td><td>'+temp.trans+'</td></tr><tr><td>REK</td><td>:</td><td>'+temp.rek+'</td></tr><tr><td>AMOUNT</td><td>:</td><td>'+temp.nominal.toLocaleString("id-ID")+'</td></tr><tr><td>SALDO</td><td>:</td><td>'+temp.saldo.toLocaleString("id-ID")+'</td></tr>';
  // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";

  var thanks = '<tr><td colspan="3" style="text-align: center;">- Terima Kasih -</td></tr>';
  // var thanks = "{center}- Terima Kasih -{br}";
  var eol = "{br}{br}{br}";
  var table_end = '</table><br><br>';

  // cetakan = kop + separator + detil + separator + setor + separator + thanks + eol;
  cetakan = table_head + kop + separator + detil + separator + setor + separator + thanks + table_end;
  to_be_previewed = cetakan;

  app.views.main.router.navigate('/preview/');
}

function printSetoran(temp){
  window.DatecsPrinter.listBluetoothDevices(function (devices) {
    window.DatecsPrinter.connect(devices[0].address, function() {
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var kop = "{br}{center} PD BPR BANK SLEMAN{br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      cetakan = kop + separator + detil + separator + setor + separator + thanks + eol;

      window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
        $.ajax({
          url: site+"/API/setoran/",
          method: "POST",
          data: JSON.stringify(temp),
          success: function(){
            app.toast.create({
              text: "Setoran Berhasil",
              closeTimeout: 3000,
              closeButton: true
            }).open();
          }
        })
      }, function() {
        alert("Gagal Mencetak, Proses Dibatalkan");
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

function posting(){
  var tot_posting = tot_simpanan + tot_pinjaman;
  var temp = {
    jenis_print : "posting",
    user : iduser,
    simpanan : tot_simpanan,
    pinjaman : tot_pinjaman,
    total : tot_posting
  }

  $.ajax({
    url: site+"/API/trans/posting/",
    method: "GET",
    success: function(result){
      temp.trans = result.trans;
      printPosting(temp);
      // previewPosting(temp);
    }
  })
}

function previewPosting(temp){
  to_be_printed = temp;
  var dt = new Date();
  var yr = dt.getFullYear();
  var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
  var dy = ('00'+dt.getDate()).slice(-2);
  var hr = ('00'+dt.getHours()).slice(-2);
  var mn = ('00'+dt.getMinutes()).slice(-2);
  var sc = ('00'+dt.getSeconds()).slice(-2);
  var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;
  var jeni_detil = '';

  var cetakan = 'Berhasil';
  var table_head = '<table><tr><th style="width: 45%"></th><th style="width: 10%"></th><th style="width: 45%"></th></tr>';

  var kop = '<tr><td colspan="3" style="text-align: center;">PD BPR BANK SLEMAN</td></tr><tr><td colspan="3" style="text-align: center;">Magelang KM10 Tridadi Sleman</td></tr><tr><td colspan="3" style="text-align: center;">Telp (0274)868321</td></tr>';
  // var kop = "{br}{center} PD BPR BANK SLEMAN{br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";

  var separator = '<tr><td colspan="3" style="border-top: dashed black 2px"></td></tr>';
  // var separator = "--------------------------------{br}";

  var post = '<tr><td colspan="3">REKAP POSTING HARIAN</td></tr><tr><td>NAMA</td><td>:</td><td>'+temp.user+'</td></tr><tr><td>NO</td><td>:</td><td>'+temp.trans+'</td></tr><tr><td>TANGGAL</td><td>:</td><td>'+timestamp+'</td></tr><tr><td>TOT SIMP</td><td>:</td><td>'+temp.simpanan.toLocaleString('id-ID')+'</td></tr><tr><td>TOT PINJ</td><td>:</td><td>'+temp.pinjaman.toLocaleString('id-ID')+'</td></tr><tr><td>TOT SETOR</td><td>:</td><td>'+temp.total.toLocaleString('id-ID')+'</td></tr>';
  // var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + temp.user + "{br}NO        : " + temp.trans + "{br}TANGGAL   : " + timestamp + "{br}TOT SIMP  : " + temp.simpanan.toLocaleString("id-ID") + "{br}TOT PINJ  : " + temp.pinjaman.toLocaleString("id-ID") + "{br}TOT SETOR : " + temp.total.toLocaleString("id-ID") + "{br}";

  var detil = '<tr><td>CIF</td><td>:</td><td>'+temp.cif+'</td></tr><tr><td>NAMA</td><td>:</td><td>'+temp.nama+'</td></tr><tr><td>OPR</td><td>:</td><td>'+iduser+'</td></tr>';
  // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

  var jeni_head = '<tr><td colspan="3"><table><tr><th style="width: 30%;"></th><th style="width: 30%;"></th><th style="width: 40%;"></th></tr>';
  var jeni_end = '</table></td></tr>';
  // var jeni = "{left}  CIF      JENIS        NOMINAL{br}";

  for(var i = 0; i < po_simpanan.length; i++){
    jeni_detil += '<tr><td>'+po_simpanan[i].cif+'</td><td>'+po_simpanan[i].rek+'</td><td style="text-align: right;">'+po_simpanan[i].nominal.toLocaleString('id-ID')+'</td></tr>';
    // jeni_detil += po_simpanan[i].cif + "   " + po_simpanan[i].rek + "   " + lpad(po_simpanan[i].nominal.toLocaleString("id-ID"), 10, ' ') + "{br}";
  }

  var setor = '<tr><td colspan="3">SETOR TUNAI</td></tr><tr><td>TANGGAL</td><td>:</td><td>'+timestamp+'</td></tr><tr><td>NO TRANS</td><td>:</td><td>'+temp.trans+'</td></tr><tr><td>REK</td><td>:</td><td>'+temp.rek+'</td></tr><tr><td>AMOUNT</td><td>:</td><td>'+temp.nominal.toLocaleString("id-ID")+'</td></tr><tr><td>SALDO</td><td>:</td><td>'+temp.saldo.toLocaleString("id-ID")+'</td></tr>';
  // var setor = "{left}SETOR TUNAI{br}TANGGAL  : " + timestamp + "{br}NO TRANS : " + temp.trans + "{br}REK      : " + temp.rek + "{br}AMOUNT   : " + temp.nominal.toLocaleString("id-ID") + "{br}SALDO    : " + temp.saldo.toLocaleString("id-ID") + "{br}";

  var thanks = '<tr><td colspan="3">- Terima Kasih -</td></tr>';
  // var thanks = "{center}- Terima Kasih -{br}";
  var eol = "{br}{br}{br}";
  var table_end = '</table><br><br>';

  cetakan = table_head + kop + separator + post + separator + jeni_head + jeni_detil + jeni_end + separator + thanks + table_end;
  to_be_previewed = cetakan;
  // cetakan = kop + separator + post + separator + jeni + jeni_detil + separator + thanks + eol;

  app.views.main.router.navigate('/preview/');
}

function printPosting(temp){
  window.DatecsPrinter.listBluetoothDevices(function (devices) {
    window.DatecsPrinter.connect(devices[0].address, function() {
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
      var dy = ('00'+dt.getDate()).slice(-2);
      var hr = ('00'+dt.getHours()).slice(-2);
      var mn = ('00'+dt.getMinutes()).slice(-2);
      var sc = ('00'+dt.getSeconds()).slice(-2);
      var timestamp = dy + "/" + mt + "/" + yr + " " + hr + ":" + mn + ":" + sc;

      var cetakan = 'Berhasil';
      var kop = "{br}{center} PD BPR BANK SLEMAN{br}Jl Magelang KM10 Tridadi Sleman{br}Telp (0274) 868321{br}";
      var separator = "--------------------------------{br}";
      // var detil = "{left}CIF  : " + temp.cif + "{br}NAMA : " + temp.nama + "{br}OPR  : " + iduser + "{br}";

      var post = "{left}REKAP POSTING HARIAN{br}NAMA      : " + temp.user + "{br}NO        : " + temp.trans + "{br}TANGGAL   : " + timestamp + "{br}TOT SIMP  : " + temp.simpanan.toLocaleString("id-ID") + "{br}TOT PINJ  : " + temp.pinjaman.toLocaleString("id-ID") + "{br}TOT SETOR : " + temp.total.toLocaleString("id-ID") + "{br}";
      var jeni = "{left}  CIF      JENIS        NOMINAL{br}";
      var thanks = "{center}- Terima Kasih -{br}";
      var eol = "{br}{br}{br}";

      var jeni_detil = '';
      var c = '1000000000';
      for(var i = 0; i < po_simpanan.length; i++){
        jeni_detil += po_simpanan[i].cif + "   " + po_simpanan[i].rek + "   " + lpad(po_simpanan[i].nominal.toLocaleString("id-ID"), 10, ' ') + "{br}";
      }

      cetakan = kop + separator + post + separator + jeni + jeni_detil + separator + thanks + eol;

      window.DatecsPrinter.printText(cetakan, 'ISO-8859-1', function(){
        for(var i = 0; i < idx.length; i++){
          var upd = {
            act : "update",
            idx : idx[i]
          }

          $.ajax({
            url: site+"/API/setoran/",
            method: "POST",
            data: JSON.stringify(upd),
            success: function(){
              console.log("Update IDX " + upd.idx + " sukses.");
            }
          })
        }

        $.ajax({
          url: site+"/API/posting/",
          method: "POST",
          data: JSON.stringify(temp),
          success: function(){
            app.toast.create({
              text: "Posting Harian Berhasil",
              closeTimeout: 3000,
              closeButton: true
            }).open();

            idx = [];
            po_simpanan = [];
            app.views.main.router.navigate('/cif/');
          }
        })
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

function laporanReport(){
  var tgl_awal = $("#tgl_awal").val();
  var tgl_akhir = $("#tgl_akhir").val();
  var c = 1;
  var temp = {
    tipe : jenis_laporan,
    tgl_awal : tgl_awal,
    tgl_akhir : tgl_akhir,
  }

  $.ajax({
    url: site+"/API/laporan/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(result){
      switch(jenis_laporan){
        case "closing":
          var total_s = 0, total_p = 0, total_t = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table>\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 20%;">Simpanan</th>\
                                <th style="width: 20%;">Pinjaman</th>\
                                <th style="width: 20%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_USER +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].SIMPANAN).toLocaleString('id-ID') +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].PINJAMAN).toLocaleString('id-ID') +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].TOTAL).toLocaleString('id-ID') +'</td>\
            ';

            total_s += parseInt(result[i].SIMPANAN);
            total_p += parseInt(result[i].PINJAMAN);
            total_t += parseInt(result[i].TOTAL);

            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="3" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb;">'+total_s.toLocaleString('id-ID')+'</td><td style="text-align: right; background: #bbb;">'+total_p.toLocaleString('id-ID')+'</td><td style="text-align: right; background: #bbb;">'+total_t.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_c').html(datanya);
          break;

        case "saving":
          var total_n = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table>\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 25%;">CIF</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 20%;">User</th>\
                                <th style="width: 25%;">Nominal</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].NO_ANGGOTA +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_USER +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].NOMINAL).toLocaleString('id-ID') +'</td>\
            ';

            total_n += parseInt(result[i].NOMINAL);
            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="4" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb;">'+total_n.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_s').html(datanya);
          break;

        case "rekap":
          var total_n = 0;
          /*var datanya = '<div class="data-table">\
                          <table>\
                            <thead>\
                              <tr>\
                                <th class="label-cell" style="width: 5%;">No</th>\
                                <th style="width: 10%;">User</th>\
                                <th style="width: 15%;">Tanggal</th>\
                                <th class="numeric-cell" style="width: 20%;">Simpanan</th>\
                                <th class="numeric-cell" style="width: 20%;">Pinjaman</th>\
                                <th class="numeric-cell" style="width: 30%;">Total</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';*/
            var datanya = '<table>\
                            <thead>\
                              <tr>\
                                <th style="width: 5%;">No</th>\
                                <th style="width: 25%;">CIF</th>\
                                <th style="width: 25%;">Tanggal</th>\
                                <th style="width: 20%;">User</th>\
                                <th style="width: 25%;">Nominal</th>\
                              </tr>\
                            </thead>\
                            <tbody>\
            ';
          for(var i = 0; i < result.length; i++){
            datanya += '<tr>\
                          <td style="text-align: center; padding: 10px 0;">'+ c +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].NO_ANGGOTA +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].TANGGAL.split(' ')[0] +'</td>\
                          <td style="text-align: center; padding: 10px 0;">'+ result[i].ID_USER +'</td>\
                          <td style="text-align: right; padding: 10px 0;">'+ parseInt(result[i].NOMINAL).toLocaleString('id-ID') +'</td>\
            ';

            total_n += parseInt(result[i].NOMINAL);
            c++;
          }

          /*datanya += '</tbody>\
                          </table>\
                        </div>\
                      ';*/

          datanya += '<tr><td colspan="4" style="text-align: right; padding-right: 10px; background: #bbb;">Total</td><td style="text-align: right; background: #bbb;">'+total_n.toLocaleString('id-ID')+'</td></tr>';  
          datanya += '</tbody>\
              </table>\
          ';

          $('#result_r').html(datanya);
          break;
      }


      console.log(result);
    }
  })
}

// UTILITY FUNCTIONS

function onBackPressed(){
  app.dialog.confirm('Keluar aplikasi?', 'Konfirmasi', function(){
    navigator.app.exitApp();
  }, function(){
    return;
  })
}

function comma(el){
  if(el.value == '') el.value = 0;
  el.value = parseInt((el.value).replace(/\D/g, '')).toLocaleString('id-ID');
}

function testPrinter(q){
  window.DatecsPrinter.listBluetoothDevices(function (devices) {
    window.DatecsPrinter.connect(devices[0].address, function(){
      window.DatecsPrinter.printText(q, 'ISO-8859-1', function(){
        console.log("berhasil");
      }, function(){
        console.log("failed");
      })
    })
  })
}

function bypassSetoran(temp){
  $.ajax({
    url: site+"/API/setoran/",
    method: "POST",
    data: JSON.stringify(temp),
    success: function(){
      app.toast.create({
        text: "Setoran Berhasil",
        closeTimeout: 3000,
        closeButton: true
      }).open();
    }
  })
}

function lpad(str, len, padstr){
  var pad = '';
  for(var i = 0; i < len; i++){
    pad += padstr;
  }

  // console.log(pad+str);
  // console.log((pad + str).slice(len*-1));
  return (pad + str).slice(len*-1);
}

function pindahLaporan(jenis){
  jenis_laporan = jenis;
}

function printChooser(){
  if(to_be_printed.jenis_print == 'setoran'){
    printSetoran(to_be_printed);
  } else if(to_be_printed.jenis_print == 'posting'){
    printPosting(to_be_printed);
  }
}

/*
  <th class="checkbox-cell">\
    <label class="checkbox">\
      <input type="checkbox"/>\
      <i class="icon-checkbox"></i>\
    </label>\
  </th>\
*/

/*
  $.each($('.data-table-row-selected'), function(k, i){
    let e = i.innerText.split('\t');
    a.push({
      rek: e[1],
      jenis: e[2],
      saldo: e[3]
      })
  })
*/