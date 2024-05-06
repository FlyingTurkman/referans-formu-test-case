'use client'

import { useForm, SubmitHandler } from "react-hook-form";
import { IoAdd, IoSave, IoTrashBinOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import Card from "@/components/Card";
import { referenceType } from "@/types";
import { v4 as uuidv4 } from 'uuid'
import { emailRegex } from "@/lib/src/regex";
import { useMask } from '@react-input/mask';


export default function Home() {

  // Form reset işlemi için ref kullanıldı
  const formRef = useRef<HTMLFormElement>(null)

  /* Input mask için useMask kullanıldı.
  Bu yapı useForm ile birlikte çalışmadığı için input içerisinde register yapılmayacak.
  Onun yerine watch('phone') ile değeri alınıp elle telefon numarasının doğruluğu kontrol edilecek.
  TODO: useMask yerine kendi mask componenti geliştirilip useForm ile uyumu test edilecek */
  const phoneInputRef = useMask({ mask: '(___) ___ __ __', replacement: { _: /\d/ } })

  // Seçilen referans statei
  const [selectedReference, setSelectedReference] = useState<referenceType | null>(null)

  // Tüm referansların statei
  const [references, setReferences] = useState<referenceType[]>([])


  const { 
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<referenceType>()

  // Telefon error mesajı için bu değer alınıyor.
  const phone = watch('phone')

  const onSubmit: SubmitHandler<referenceType> = ((data) => {
    saveReference(data)
  })

  useEffect(() => {

    // Referans seçilince form içeriği dolduruluyor.
    if (selectedReference) {
      setValue('id', selectedReference.id)
      setValue('email', selectedReference.email)
      setValue('fullName', selectedReference.fullName)
      setValue('phone', selectedReference.phone)
      setValue('reference', selectedReference.reference)
    }

    console.log('selected', selectedReference)
  }, [selectedReference])
  return (
    <main>
      <div className="flex flex-col gap-2 max-w-[800px] mx-auto mt-20 p-4 bg-white rounded-lg">
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-gray-600 font-bold text-lg">Referanslar</label>
          <label className="text-gray-600 font-bold text-sm">Referans eklemek, şirketlerin sana karşı güvenini arttırır ve seni öne çıkarır</label>
        </div>
        <hr/>

        {/* Referans işlemleri formu */}
        <form ref={formRef} className="flex flex-col gap-6 flex-wrap" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="flex flex-row">
            <div className="flex p-4 basis-full md:basis-1/2">

              {/* Ad-Soyad input */}
              <div className="formInputField">
                <label>
                  Adı Soyadı
                  <b className="text-red-600">*</b>
                </label>
                <input
                className={`${errors.fullName?.message? 'formInputError': ''} formInput`}
                {...register('fullName', {
                  required: 'Lütfen adınızı ve soyadınız giriniz.'
                })}
                placeholder="Adınız-soyadınız"
                />
                {errors.fullName?.message? (
                  <label className="formErrorLabel">{errors.fullName.message}</label>
                ): null}
              </div>
            </div>
            <div className="flex p-4 basis-full md:basis-1/2">

              {/* Firma-Görev input */}
              <div className="formInputField">
                <label>
                  Çalıştığı Firma/Görevi
                  <b className="text-red-600">*</b>
                </label>
                <input
                className={`${errors.reference?.message? 'formInputError': ''} formInput`}
                {...register('reference', {
                  required: 'Lütfen çalıştığınız firma ve görevinizi giriniz.'
                })}
                placeholder="Firma/Görev"
                />
                {errors.reference?.message? (
                  <label className="formErrorLabel">{errors.reference.message}</label>
                ): null}
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex p-4 basis-full md:basis-1/2">

              {/* Telefon input */}
              <div className="formInputField">
                <label>
                  Telefon
                </label>
                <input
                className={`${errors.phone?.message? 'formInputError': ''} formInput`}
                ref={phoneInputRef}
                value={watch('phone') || ''}
                onChange={((e) => setValue('phone', e.target.value))}
                placeholder="(___) ___ __ __"
                />
                {phone && phone.length != 15? (
                  <label className="formErrorLabel">Lütfen geçerli bir telefon numarası giriniz.</label>
                ): null}
              </div>
            </div>
            <div className="flex p-4 basis-full md:basis-1/2">

              {/* Email input */}
              <div className="formInputField">
                <label>
                  E-Posta
                  <b className="text-red-600">*</b>
                </label>
                <input
                className={`${errors.email?.message? 'formInputError': ''} formInput`}
                {...register('email', {
                  required: 'Lütfen e-posta adresinizi giriniz.',
                  pattern: {
                    value: emailRegex,
                    message: 'Lütfen geçerli bir e-posta adresi giriniz.'
                  }
                })}
                placeholder="e-posta@domain.com"
                />
                {errors.email?.message? (
                  <label className="formErrorLabel">{errors.email.message}</label>
                ): null}
              </div>
              
            </div>
          </div>
          <hr/>
          <div className="flex flex-row items-center gap-2">
            <button className="buttonDestructive" type="button" onClick={deleteReference}>
              <IoTrashBinOutline className="text-xl"/>
              Referansı Sil
            </button>
            <button type="submit">
              <IoSave className="text-xl"/>
              Referansı Kaydet
            </button>
          </div>
          <hr/>
          <div className="flex flex-row items-start">
            <button type="button" className="buttonGreen" onClick={newReference}>
              <IoAdd className="text-xl"/>
              Yeni Referans Ekle
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-2 max-w-[800px] mx-auto mt-20 p-4 bg-white rounded-lg">
        {references.length == 0? (
          <label className="text-gray-600">Hiç referans eklemediniz.</label>
        ): (
          <>
           {references.map((reference, i) => {
            return(
              <Card 
              key={`referenceCard-${i}`} 
              reference={reference}
              selectedReference={selectedReference}
              setSelectedReference={setSelectedReference}
              />
            )
           })}
          </>
        )}
      </div>
    </main>
  );

  function newReference() {

    // Yeni referans işlemi için form reset
    if (formRef && formRef.current) {
      formRef.current.reset()
      formRef.current.focus()
      setSelectedReference(null)
      setValue('phone', '')
    }
  }

  function deleteReference() {

    // Seçilen referansı silme
    if (selectedReference) {
      setReferences((oldReferences) => oldReferences.filter((r) => r.id != selectedReference.id))
      setSelectedReference(null)

      if (formRef && formRef.current) {
        formRef.current.reset()

        setValue('phone', '')
      }
    }
  }

  function saveReference({id, ...data}: referenceType) {
    if (!selectedReference) {

      // Seçilen referans yok ise yeni bir referans ekler
      if (data.phone && data.phone.length != 15) {
        return
      }

      const referenceData: referenceType = {
        id: uuidv4(),
        ...data
      }
      setReferences((oldReferences) => [...oldReferences, referenceData])

      if (formRef && formRef.current) {
        formRef.current.reset()
        setSelectedReference(null)
      }

      setValue('phone', '')
    } else {

      // Seçilen referans var ise id bilgisine göre filtreleme yapar ardından yeni referans bilgilerini ekler
      const referenceData: referenceType = {
        id,
        ...data
      }

      setReferences((oldReferences) => [referenceData, ...oldReferences.filter((r) => r.id != id)])
    }
  }
}
