'use server'

export async function getSendCode() {
    console.log("ejecutando getSendCode...")

    const response = await fetch(
        "https://qaizzi.izzi.mx/WSVeL/webservices/izzi/envio_codigo_v2",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "medio": "CORREO",
                "oferta": "IZZI",
                "origin": "WEB",
            },
            body: JSON.stringify({
                oferta: "IZZI",
                medio: "CORREO",
                idTransaction: "acfd6eff-a2f6-11f0-84a1-0205516d054d",
                phone: "7772085039",
                mail: "juanarodriguez@deloitte.com",
                name: "DAVID",
                lastname: "ABARCA",
                package: "izzi 80 + izzitv HD",
                descriptionPackage: "Llamadas ilimitadas. Internet de 80 Megas. izzitv HD con mas de 60 canales en vivo, además de acceso a izzi go y kids",
                price: 790,
                addons: [
                    {
                        name: "Stingray Karaoke",
                        price: "95"
                    },
                    {
                        name: "Dog TV",
                        price: "89"
                    },
                    {
                        name: "ATV HD",
                        price: 115
                    }
                ],
                promos: [],
                "priceAddons": 299,
                "priceWithoutPromo": 1089,
                "priceWithPromo": 1089,
                "priceMobile": 0,
                "promoMobile": 0,
                "promoPackage": [
                    {
                        "name": "Netflix Estándar con anuncios",
                        "amount": "119",
                        "duration": 12,
                        "permanent": "NO",
                        "startMonth": 1
                    },
                    {
                        "name": "Vix Premium",
                        "amount": "119",
                        "duration": 12,
                        "permanent": "NO",
                        "startMonth": 1
                    },
                    {
                        "name": "LALIGA EA sports",
                        "amount": 0,
                        "duration": 0,
                        "permanent": "SI",
                        "startMonth": 1
                    },
                    {
                        "name": "Skeelo",
                        "amount": 0,
                        "duration": 0,
                        "permanent": "SI",
                        "startMonth": 1
                    },
                    {
                        "name": "izzi ahorro",
                        "amount": 139,
                        "duration": 0,
                        "permanent": "SI",
                        "startMonth": 1
                    }
                ]
            })
        }
    );
    console.log('estado:', response.status)

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'API fetch error' }), { status: 500 })
    }
    const text = await response.text()
    console.log('texto de respuesta', text)
    const data = await response.json();
    return data;
}

export async function getVerifyCode() {

    const response = await fetch(
        "https://qaizzi.izzi.mx/WSVeL/webservices/izzi/envio_codigo_v2",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "medio": "CORREO",
                "oferta": "IZZI",
            },
            body: JSON.stringify({
                idTransaction: "acfd6eff-a2f6-11f0-84a1-0205516d054d",
                codigo: ""
            })
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify({ error: 'API fetch error' }), { status: 500 })
    }
    const text = await response.text()
    console.log('texto de respuesta verificaCode', text)
    const data = await response.json();
    return data;
}

