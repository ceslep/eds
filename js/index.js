'use strict';


var server = servidor.indexOf("5500") > 0 ? "http://127.0.0.1/estacion/php/" : "php/";
var tableClientes;
var tableInventarios;

class Venta {
    constructor(index, cliente, codigo, nombre, cantidad, precio) {

        this.index = index;
        this.cliente = cliente;
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
    }

};



$(document).ready(_ => {




    $(".nav-link").click(async e => {
        e.preventDefault();
        $(".navbar-toggler").click();
        $("[id^='c_']").addClass("d-none");
        let page = $(e.currentTarget).data("page");
        $(`#${page}`).removeClass("d-none");
        switch (page) {

            case "c_clientes": tablaClientes(await getClientes()); break;
            case "c_inventarios": getInventarios(await getCodigos()); break;
            case "c_ventas": ; break;
        }



    });


    var data = Bind({
        venta: {
            info: null,
            total: 0,
            itemsVenta: new Array(),
        }
    }, {
        venta: {
            callback: function () {


            },
        },

       
        
        'venta.info': {
            dom: '.info',
            transform: function (v) {
                if (isNaN(v))
                    return v;
            }
        },
        'venta.total': {
            dom: '.total',
            transform: function (v) {

                if (!isNaN(v))
                    return '$ ' + parseFloat(v).toLocaleString('es-CO');
            }
        },
        'venta.itemsVenta': {
            dom: ".tventas",
            transform: function (v) {

                
                let html = `
                    <tr data-index="${v.index}">
                    <td>
                        ${v.index}
                    </td>
                    <td>
                        ${v.nombre}
                    </td>
                    <td contenteditable="false" class="tdEditable">
                        ${v.cantidad}
                    </td>
                    <td class="text-right">
                        
                        $ ${v.precio.toLocaleString("es-CO")}.
                    </td>
                    <td class="text-center dt">
                    <a href="#!" data-index="${v.index}" class="delete">
                        <i class="fas fa-trash-alt text-danger"></i>
                    </a>
                    </td>
                </tr>       
                    `;
                return html;

            }
        }


    });

    const getClientes = async _ => {

        let response = await fetch(server + "getClientes.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });
        return await response.json();
    }

    const tablaClientes = async clientes => {

        let html = "";
        let k = 1;
        clientes.forEach(cliente => {
            html += `
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


        if (!(typeof tableClientes !== undefined))
            tableClientes.destroy();


        tableClientes = $('#tableClientes').DataTable({
            "language": {
                "url": "js/mdbjs/Spanish.json"
            }
        });


        $('.dataTables_length').addClass('bs-select');

    }






    const getCodigos = async _ => {

        let response = await fetch(server + "getInventario.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "cors"
        });
        return await response.json();

    }

    const getInventarios = async inventarios => {
        let html = "";
        let k = 1;
        inventarios.forEach(inventario => {
            html += `
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
        if (tableInventarios !== undefined)
            tableInventarios.destroy();


        tableInventarios = $('#tableInventarios').DataTable({
            "language": {
                "url": "js/mdbjs/Spanish.json"
            }
        });


        $('.dataTables_length').addClass('bs-select');

    }

    $("#prbJS").click(e => {
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
        printJS({ printable: someJSONdata, properties: ['name', 'email', 'phone'], type: 'json' })
    });


    (async () => {
        try {
            const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
            console.log(`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`);
            $("#log").text(`Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`)
        } catch (error) {
            console.log('Argh! ' + error);
            $("#log").text('Argh! ' + error);
        }
    })();

    if ('onavailabilitychanged' in navigator.bluetooth) {
        navigator.bluetooth.addEventListener('availabilitychanged', function (event) {
            console.log(`> Bluetooth is ${event.value ? 'available' : 'unavailable'}`);
            $("#log").text(`Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`)
        });
    }


    const selClientes = (async _ => {
        let html = '<option value="" disabled selected>Seleccione un cliente</option>';
        let clientes = await getClientes();
        clientes.forEach(cliente => {
            html += `<option value="${cliente.identificacion}" data-secondary-text="${cliente.identificacion}">${cliente.nombres}</option>`;
        });
        $("#cliente").empty().html(html);
        $('#cliente').select2({

        });
    })();

    const selCodigos = (async _ => {
        let html = '<option value="" disabled selected>Seleccione un código</option>';
        let codigos = await getCodigos();
        codigos.forEach(codigo => {
            html += `<option data-info="${codigo.Referencia} ${codigo.Presentacion} ${codigo.Proveedor}" data-precio="${codigo.Venta}" data-compra="${codigo.Costo}" value="${codigo.ean13}" data-secondary-text="${codigo.Referencia}">${codigo.Producto}:${codigo.ean13}</option>`;
        });
        $("#codigo").empty().html(html);
        $('#codigo').select2({

        });
    })();

    $("#cliente").change(e=>{
        let cliente=$(e.currentTarget).val();
        console.log(cliente);
        let i=0;
        data.venta.cliente=cliente;
        data.venta.itemsVenta.forEach(_=>{
           data.venta.itemsVenta[i].cliente=cliente;
           console.log(data.venta.itemsVenta[i]);
           i++;
        });
        console.log(data.__export());
    });

    $(document).on("change", "#codigo", e => {

        data.precio = parseInt($("#codigo option:selected").data("precio"));
        data.compra = parseInt($("#codigo option:selected").data("compra"));
        data.info = $("#codigo option:selected").data("info");
        data.info = data.info.replace("null", "");
        data.info = data.info.replace("null", "");
        data.venta.itemsVenta.push(new Venta(data.venta.itemsVenta.length + 1,data.venta.cliente, $("#codigo").val(), data.info, parseInt($("#cantidad").val()), parseInt($("#cantidad").val()) * data.precio));
        $("#cantidad").val("1");
        calculaTotal();
    });




    var code = "";
    var reading = false;

    $(window).on("keydown", e => {
        if (e.keyCode === 13) {
            if (code.length > 10) {
                console.log(code);
                $("#codigo").val(code).trigger("change");
                console.log(code);
                /// code ready to use                
                code = "";
            }
        } else {
            code += e.key;//while this is not an 'enter' it stores the every key 

        }
        //run a timeout of 200ms at the first read and clear everything
        if (!reading) {
            reading = true;
            setTimeout(() => {
                code = "";
                reading = false;
            }, 100);
        }
    });

    $(document).on("click", ".delete", e => {

        let filter = $(e.currentTarget).data("index");
        data.venta.itemsVenta = data.venta.itemsVenta.filter(item => item.index !== filter);
        calculaTotal();
    });


    $(document).on("click", ".tdEditable", e => {
        let celda = $(e.currentTarget);
        $(e.currentTarget).attr("contenteditable", true);

    });

    $(document).on("blur", ".tdEditable", e => {

        let celda = $(e.currentTarget);
        let index = parseInt(celda.parent().data("index"));
        console.log(data.venta.itemsVenta[index - 1]);
        let cantidad = parseInt(celda.text());
        data.venta.itemsVenta[index - 1].cantidad = cantidad;
        data.venta.itemsVenta[index - 1].precio = cantidad * data.venta.itemsVenta[index - 1].precio;
        data.venta.itemsVenta.push(new Venta(0,0, 0, 0, 0, 0));
        data.venta.itemsVenta.pop();
        calculaTotal();

    });


    const calculaTotal = _ => {
        data.venta.total = 0;
        data.venta.itemsVenta.forEach(obj => {
            console.log(obj.precio);
            if (!isNaN(obj.precio))
                data.venta.total += parseInt(obj.precio);
        });
    }


    $("#frmVentas").submit(async e => {
        e.preventDefault();
       
        let ay = new Array();
        ay = [...data.venta.itemsVenta];

        $("input[name='itemsVenta']").val(JSON.stringify(ay));
        //console.log($("input[name='itemsVenta']").val());
        let frmData = JSON.stringify($(e.currentTarget).serializeObject());
        console.log(frmData);
        let response = await fetch(server + "guardarVenta.php", {
            method: "POST",
            body: JSON.stringify(ay),
            headers: { "Content-Type": "application/json" },
            mode: "cors",
        });
        let venta = await response.json();
        console.log(venta);
    });

});

