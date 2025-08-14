'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Button, Form, Input } from '@heroui/react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const mapContainerStyle = { height: "400px", width: "50%" }
const center = { lat: 19.4294087, lng: -99.1624372 }
const libraries: ('places')[] = ['places']

function handleGeolocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude)
  })
}

export default function Cobertura() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(null)
  const autocompleteRef = useRef<any>(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setSubmitted(data)
  }

  useEffect(() => {
    if (!autocompleteRef.current) return

    const handlePlaceChange = () => {
      const place = autocompleteRef.current.value
      console.log("Selected place text:", place)
      // You can call the Places API separately to get lat/lng if needed
    }

    autocompleteRef.current.addEventListener("gmpx-placechange", handlePlaceChange)
    return () => {
      autocompleteRef.current?.removeEventListener("gmpx-placechange", handlePlaceChange)
    }
  }, [])

  return (
    <div className="items-center justify-center mb-8 mx-sm xl:mx-xl xl:justify-start">
      <div className='flex flex-col'>
        <p className="text-[32px] font-bold">Comprueba tu cobertura</p>
        <p className="text-[18px]">
          Ingresa tu dirección y te mostraremos los paquetes y promociones que puedes contratar.
        </p>
      </div>

      <div className='flex flex-col-2 mt-8'>
        <div className='w-1/2'>
          <Button onPress={handleGeolocation}>
            utilizar mi ubicación actual
          </Button>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Form className="w-full max-w-xs" onSubmit={onSubmit}>
              <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onValueChange={setEmail}
              />
              <Button type="submit" variant="bordered">
                Submit
              </Button>
              {submitted && (
                <div className="text-small text-default-500">
                  You submitted: <code>{JSON.stringify(submitted)}</code>
                </div>
              )}
            </Form>
          </div>
        </div>

        <LoadScript
          googleMapsApiKey="AIzaSyD-eoqjwSEEiNrhDLflqPm5hBsLaUTGSXI"
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
          >
            {/* New Autocomplete Element */}
            <gmpx-place-autocomplete
              ref={autocompleteRef}
              placeholder="Buscar lugar"
              style={{
                width: "300px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "#fff",
              }}
            ></gmpx-place-autocomplete>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}
