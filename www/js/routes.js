var routes = 
[
  {
    path: '/',
    url: './index.html',
    name: 'login',
    history: false
  },
  {
    path: '/home/',
    componentUrl: './pages/home.html',
    name: 'home',
    history: false
  },
  {
    path: '/cif/',
    componentUrl: './pages/cif.html',
    name: 'cif',
    history: false,
    on: {
      pageAfterIn: function(){
        ac = app.autocomplete.create({
          inputEl: '#input_cif',
          openIn: 'dropdown',
          preloader: true,
          limit: 10,
          source: function(query, render){
            var autoc = this;
            var results = [];
            var temp = {
              "query" : query
            }

            /*if(query.length === 0){
              render(results);
              return;
            }*/

            if(query.length <= 3){
              render(results);
              return;
            }

            autoc.preloaderShow();
            $.ajax({
              url: site+'/API/cari/',
              method: 'POST',
              data: JSON.stringify(temp),
              success: function(result){
                for(var i = 0; i < result.length; i++){
                  if(result[i].CIF.indexOf(query) >= 0 || result[i].SSNAMA.indexOf(query.toUpperCase()) >= 0) results.push(result[i].CIF+' - '+result[i].SSNAMA);
                }

                autoc.preloaderHide();
                render(results);
              }
            })
          },
          on: {
            change: function(value){
              cekCIF('cif', value[0].split(' - ')[0])
            }
          }
        });
      }
    }
  },
  {
    path: '/coll_simpanan/',
    componentUrl: './pages/coll_simpanan.html',
    name: 'coll_simpanan',
    on: {
      pageAfterIn: function(){
        ac = app.autocomplete.create({
          inputEl: '#input_colls',
          openIn: 'dropdown',
          preloader: true,
          limit: 10,
          source: function(query, render){
            var autoc = this;
            var results = [];
            var temp = {
              "query" : query
            }

            /*if(query.length === 0){
              render(results);
              return;
            }*/

            if(query.length <= 3){
              render(results);
              return;
            }

            autoc.preloaderShow();
            $.ajax({
              url: site+'/API/cari/',
              method: 'POST',
              data: JSON.stringify(temp),
              success: function(result){
                for(var i = 0; i < result.length; i++){
                  if(result[i].CIF.indexOf(query) >= 0 || result[i].SSNAMA.indexOf(query.toUpperCase()) >= 0) results.push(result[i].CIF+' - '+result[i].SSNAMA);
                }

                autoc.preloaderHide();
                render(results);
              }
            })
          },
          on: {
            change: function(value){
              cekCIF('coll_s', value[0].split(' - ')[0])
            }
          }
        });
      }
    }
  },
  {
    path: '/coll_angsuran/',
    componentUrl: './pages/coll_angsuran.html',
    name: 'coll_angsuran',
    on: {
      pageAfterIn: function(){
        ac = app.autocomplete.create({
          inputEl: '#input_colla',
          openIn: 'dropdown',
          preloader: true,
          limit: 10,
          source: function(query, render){
            var autoc = this;
            var results = [];
            var temp = {
              "query" : query
            }

            /*if(query.length === 0){
              render(results);
              return;
            }*/

            if(query.length <= 3){
              render(results);
              return;
            }

            autoc.preloaderShow();
            $.ajax({
              url: site+'/API/cari/',
              method: 'POST',
              data: JSON.stringify(temp),
              success: function(result){
                for(var i = 0; i < result.length; i++){
                  if(result[i].CIF.indexOf(query) >= 0 || result[i].SSNAMA.indexOf(query.toUpperCase()) >= 0) results.push(result[i].CIF+' - '+result[i].SSNAMA);
                }

                autoc.preloaderHide();
                render(results);
              }
            })
          },
          on: {
            change: function(value){
              cekCIF('coll_a', value[0].split(' - ')[0])
            }
          }
        });
      }
    }
  },
  {
    path: '/posting/',
    // componentUrl: './pages/report.html',
    name: 'posting',
    template: '\
      <div class="page" data-name="cif">\
        <div class="navbar">\
          <div class="navbar-inner">\
            <div class="left">\
              <a href="#" class="link icon-only panel-open" data-panel="left">\
                <i class="f7-icons md-only">menu</i>\
                <span class="ios-only">Menu</span>\
              </a>\
            </div>\
            <div class="title">Posting Harian</div>\
          </div>\
        </div>\
        <div class="toolbar toolbar-bottom-md no-shadow color-blue">\
          <div class="toolbar-inner">\
            <button class="button" id="proses_posting" onclick="posting()">Selesai</button>\
          </div>\
        </div>\
        <div class="page-content">\
          <div class="block" id="sub"></div>\
          <div class="block">\
            <div class="data-table card">\
              <div class="card-header">\
                <div class="data-table-title">Collection Simpanan</div>\
              </div>\
              <div class="card-content" id="detil_posting">\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    ',
    on: {
      pageAfterIn: function(){
        var dt = new Date();
        var yr = dt.getFullYear();
        var mt = ('00'+(dt.getMonth() + 1)).slice(-2);
        var dy = ('00'+dt.getDate()).slice(-2);

        var sub = '<table style="width: 100%; padding-left: 16px;">\
                    <tr>\
                      <td colspan="3" style="text-align: left;"><b>Posting Harian (End Of Day)</b></td>\
                    </tr>\
                    <tr>\
                      <td width="15%"><b>Nama</b></td>\
                      <td width="5%"><b>:</b></td>\
                      <td width="80%"><b>'+iduser+'</b></td>\
                    </tr>\
                    <tr>\
                      <td width="15%"><b>Tanggal</b></td>\
                      <td width="5%"><b>:</b></td>\
                      <td width="80%"><b>'+dy+'-'+mt+'-'+yr+'</b></td>\
                    </tr>\
                  </table>\
        ';

        $('#sub').html(sub);

        var simpanan = '<table>\
                      <thead>\
                        <tr>\
                          <th class="label-cell">No Transaksi</th>\
                          <th >CIF</th>\
                          <th class="numeric-cell">Nominal</th>\
                        </tr>\
                      </thead>\
                      <tbody>\
        ';

        $.ajax({
          url: site+"/API/posting/"+iduser+"/",
          method: "GET",
          success: function(result){
            for(var i = 0; i < result.length; i++){
              var temp = {
                cif : result[i].NO_ANGGOTA,
                rek : result[i].ID_SIMPANAN,
                nominal : parseInt(result[i].NOMINAL)
              }

              po_simpanan.push(temp);
              idx.push(result[i].IDX);

              tot_simpanan += parseInt(result[i].NOMINAL);
              simpanan += '<tr>\
                        <td class="label-cell">'+result[i].NO_TRANSAKSI+'</td>\
                        <td >'+result[i].NO_ANGGOTA+'</td>\
                        <td class="numeric-cell">'+parseInt(result[i].NOMINAL).toLocaleString('id-ID')+'</th>\
                      </tr>\
              ';
            }

            simpanan += "</tbody></table>";
            $('#detil_posting').html(simpanan);
          }

        })
      }
    }
  },
  {
    path: '/report_c/',
    componentUrl: './pages/report_c.html',
    name: 'report_closing'
  },
  {
    path: '/report_s/',
    componentUrl: './pages/report_s.html',
    name: 'report_saving'
  },
  {
    path: '/report_r/',
    componentUrl: './pages/report_r.html',
    name: 'report_rekap'
  },
  {
    path: '/preview/',
    componentUrl: './pages/preview.html',
    name: 'preview',
    on: {
      pageAfterIn: function(){
        $('#preview_printer').html(to_be_previewed);
      }
    }
  }
];