'use strict';


var server = servidor.indexOf("5500")>0?"http://127.0.0.1/estacion/php/":"php/";
var tableClientes;
var tableInventarios;

class Venta{
    constructor(index,codigo,nombre,cantidad,precio) { 
        
        this.index=index;
        this.codigo=codigo;
        this.nombre=nombre;
        this.cantidad=cantidad;
        this.precio=precio;
      } 
    
};

var arrayVentas=[];

$(document).ready(_=>{


    

    $(".nav-link").click(async e=>{
            e.preventDefault();
            $(".navbar-toggler").click();
            $("[id^='c_']").addClass("d-none");
            let page = $(e.currentTarget).data("page");
            $(`#${page}`).removeClass("d-none");
            switch(page){

                case "c_clientes":tablaClientes(await getClientes());break;
                case "c_inventarios":getInventarios(await getCodigos());break;
                case "c_ventas":ventas();break;    
            }


            
    });


    var data = Bind({
        cliente: null,
        ean13: null,
        precio: 0,
        compra: 0,
        info: null,
        total :0,
      }, {
        cliente: '.cliente',
        ean13: '.ean13',
        precio: {
            dom: '.precio',
              transform: function (v) {
              if (!isNaN(v))    
              return '$ ' + parseFloat(v).toLocaleString('es-CO');
              else return "";
            }
        },
        compra: {
            dom: '.compra',
              transform: function (v) {
              if (!isNaN(v))
              return '$ ' + parseFloat(v).toLocaleString('es-CO');
            }
        },
        info: {
            dom: '.info',
              transform: function (v) {
              if (isNaN(v))    
              return v;
            }
        },
        total: {
            dom: '.total',
              transform: function (v) {
              if (!isNaN(v))
              return '$ ' + parseFloat(v).toLocaleString('es-CO');
            }
        }
      });

    const getClientes = async _=>{

        let response = await fetch(server+"getClientes.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            mode:"cors"
        });
        return await response.json();
    }   

     const tablaClientes = async clientes =>{   
       
        let html="";
        let k=1;
        clientes.forEach(cliente=>{
            html+=`
                <tr>    
                        <th scope="row">${k}</th>
                        <td>
                            ${cliente.identificacion}
                        </td>
                        <td>
                            ${cliente.nombres}
                        </td>
                </tr>
            `;
            k++;
        });
        $("#tClientes").empty().html(html);
        
        
        if(!(typeof tableClientes!==undefined))
        tableClientes.destroy();

   
        tableClientes = $('#tableClientes').DataTable({
            "language": {
                "url": "js/mdbjs/Spanish.json"
            }
        });
        
        
        $('.dataTables_length').addClass('bs-select');

    }


    const ventas = _=>{

        arrayVentas=[];
    }

    

    const getCodigos = async _=>{

        let response = await fetch(server+"getInventario.php",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            mode:"cors"
        });
        return await response.json();

  }      

  const getInventarios = async inventarios =>{ 
        let html="";
        let k=1;
        inventarios.forEach(inventario=>{
            html+=`
                <tr>    
                        <th scope="row">${k}</th>
                        <td>
                            ${inventario.ean13}
                        </td>
                        <td>
                            ${inventario.Producto}
                        </td>
                        <td>
                            ${inventario.Referencia}
                        </td>
                        <td>
                            ${inventario.Presentacion}
                        </td>
                        <td>
                            ${inventario.Proveedor}
                        </td>
                        <td>
                            ${inventario.Precio}
                        </td>
                        
                        
                        
                </tr>
            `;
            k++;
        });
        $("#tInventarios").empty().html(html);
       
        console.log(tableInventarios);
        if(tableInventarios!==undefined)
        tableInventarios.destroy();

   
        tableInventarios = $('#tableInventarios').DataTable({
            "language": {
                "url": "js/mdbjs/Spanish.json"
            }
        });
        
        
        $('.dataTables_length').addClass('bs-select');

    }

    $("#prbJS").click(e=>{
        let 
        someJSONdata = [
           {
              name: 'John Doe',
              email: 'john@doe.com',
              phone: '111-111-1111'
           },
           {
              name: 'Barry Allen',
              email: 'barry@flash.com',
              phone: '222-222-2222'
           },
           {
              name: 'Cool Dude',
              email: 'cool@dude.com',
              phone: '333-333-3333'
           }
        ];
        printJS({printable: someJSONdata, properties: ['name', 'email', 'phone'], type: 'json'})
    });


    (async () => {
        try {
          const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
          console.log(`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`);
          $("#log").text(`Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`)
        } catch(error) {
          console.log('Argh! ' + error);
          $("#log").text('Argh! ' + error);
        }
      })();
      
      if ('onavailabilitychanged' in navigator.bluetooth) {
        navigator.bluetooth.addEventListener('availabilitychanged', function(event) {
          console.log(`> Bluetooth is ${event.value ? 'available' : 'unavailable'}`);
          $("#log").text(`Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`)
        });
      }


      const selClientes = (async _=>{
          let html='<option value="" disabled selected>Seleccione un cliente</option>';
          let clientes = await getClientes();
           clientes.forEach(cliente=>{
               html+=`<option value="${cliente.identificacion}" data-secondary-text="${cliente.identificacion}">${cliente.nombres}</option>`;
           }); 
           $("#cliente").empty().html(html);
           $('#cliente').select2({
            
          });
      })();

      const selCodigos = (async _=>{
        let html='<option value="" disabled selected>Seleccione un código</option>';
        let codigos = await getCodigos();
         codigos.forEach(codigo=>{
             html+=`<option data-info="${codigo.Referencia} ${codigo.Presentacion} ${codigo.Proveedor}" data-precio="${codigo.Venta}" data-compra="${codigo.Costo}" value="${codigo.ean13}" data-secondary-text="${codigo.Referencia}">${codigo.Producto}:${codigo.ean13}</option>`;
         }); 
         $("#codigo").empty().html(html);
         $('#codigo').select2({
          
        });
    })();



    const tableVentas = arrayVentas=>{

        let html="";
        let ki=1;
        let total=0;
        arrayVentas.forEach((vt,i)=>{
           
            html+=`
                    <tr>
                        <td>
                            ${ki}
                        </td>
                        <td>
                            ${vt.nombre}
                        </td>
                        <td>
                            ${vt.cantidad}
                        </td>
                        <td class="float-left">
                            $ ${vt.precio.toLocaleString("es-CO")}.
                        </td>
                        <td>
                        <a href="#!" data-index="${ki}" class="delete">
                            <i class="fas fa-trash-alt text-danger"></i>
                        </a>
                        </td>
                    </tr>
        `;
         arrayVentas[i].index=ki;
         ki++;   
         total+=vt.precio;   
         
    });
    data.total=parseInt(total);
    $("#tventas").empty().html(html);  
    $("#tableventas").removeClass("d-none");
    
}

    $(document).on("change","#codigo",e=>{
        
        data.precio = parseInt($("#codigo option:selected").data("precio"));
        data.compra = parseInt($("#codigo option:selected").data("compra"));
        data.info = $("#codigo option:selected").data("info");
        data.info = data.info.replace("null","");
        data.info = data.info.replace("null","");
        
        let venta = new Venta(arrayVentas.length+1,$("#codigo").val(),data.info,parseInt($("#cantidad").val()),parseInt($("#cantidad").val())*data.precio);
        arrayVentas.push(venta);
        tableVentas(arrayVentas);
        $("#cantidad").val("1");
    });

    $("#frmVentas").submit(async e=>{
        e.preventDefault();
        console.log($(e.currentTarget).serializeObject());
        let response = await fetch()
    });


    var code="";
    var reading = false;

    $(window).on("keydown",e=>{
        if (e.keyCode===13){
            if(code.length>10){
              console.log(code);
              $("#codigo").val(code).trigger("change");
              console.log(code);
              /// code ready to use                
              code="";
           }
      }else{
           code+=e.key;//while this is not an 'enter' it stores the every key 
           
      }
     //run a timeout of 200ms at the first read and clear everything
      if(!reading){
           reading=true;
           setTimeout(()=>{
            code="";
            reading=false;
        }, 100);
    }
});

  $(document).on("click",".delete",e=>{

        let filter=$(e.currentTarget).data("index");
        console.log(filter);
        arrayVentas = arrayVentas.filter(item => item.index !== filter);
        tableVentas(arrayVentas);
        console.log(arrayVentas);
  });
    
});