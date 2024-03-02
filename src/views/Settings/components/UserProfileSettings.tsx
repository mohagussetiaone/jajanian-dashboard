import { Transition } from '@headlessui/react'
import { useQueryClient } from '@tanstack/react-query'
import profiles from 'assets/img/avatars/avatar.png'
import axios from 'axios'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import Compressor from 'compressorjs'
import CryptoJS from 'crypto-js'
import FormData from 'form-data'
import { OTPInput, SlotProps } from 'input-otp'
import { Image } from 'lucide-react'
import NSFWFilter from 'nsfw-filter'
import {
  ChangeEventHandler,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react'
import Countdown from 'react-countdown'
import toast from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'
import Card from '../../../components/card'
import { clearAllStorage } from '../../../store/Local/Forage-Helpers'
import { useProfileStore } from '../../../store/Profile/StoreProfile'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const UserProfileSettings: React.FC<{ authToken: string }> = ({
  authToken,
}) => {
  const inputImageRef = useRef(null)
  const queryClient = useQueryClient()
  const { profile } = useProfileStore()
  const imageSrc = profile?.data?.image
    ? `data:image/png;base64,${profile?.data?.image}`
    : profiles

  const [formData, setFormData] = useState({
    nama: '' || profile?.data?.name,
    notelp: '' || profile?.data?.phone,
    email: '' || profile?.data?.email,
  })
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [isEmailChanged, setIsEmailChanged] = useState(false)
  const [otpEmail, setOtpEmail] = useState(null)
  const [OTPFinal, setOTPFinal] = useState(null)
  const [userOTPInput, setUserOTPInput] = useState(null)
  const [paymentDetailsVisibility, setPaymentDetailsVisibility] =
    useState(false)

  const [countDownExist, setCountDownExist] = useState(true)
  const [imageURL, setImageUrl] = useState(null)
  const [showImageSRC, setShowImageSRC] = useState(null)

  const validatePhoneNumber = (phoneNumber: string) => {
    const regex = /^(62)([0-9]{3,4}){2}[0-9]{3,4}$/
    return regex.test(phoneNumber)
  }

  const handleNamaChange = (e: { target: { value: string } }) => {
    const { value } = e.target
    setFormData({ ...formData, nama: value })
    setIsFormChanged(true)
  }

  const handlePhoneNumberChange = (e: { target: { value: any } }) => {
    const { value } = e.target
    setFormData({ ...formData, notelp: value })
    setIsFormChanged(true)
  }

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files[0] as File

    // Check to see if the image is appropriate
    const isSafe = await NSFWFilter.isSafe(file)
    if (!isSafe) {
      toast.error('Maaf file ini tidak diperbolehkan')
      return
    }

    // Check if it's a File
    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']
      const extension = file.name.split('.').pop().toLowerCase()

      if (allowedExtensions.includes(extension)) {
        new Compressor(file, {
          quality: 0.72,
          success: (compressedFile: File) => {
            console.log('compress', compressedFile)

            const readerArrayBuffer = new FileReader()
            readerArrayBuffer.onload = (event) => {
              const blob = new Blob([event.target.result], {
                type: compressedFile.type,
              })
              console.log('blob', blob)
              const newFile = new File([blob], compressedFile.name, {
                lastModified: compressedFile.lastModified,
              })
              setImageUrl(newFile)
              setIsFormChanged(true)
            }
            readerArrayBuffer.readAsArrayBuffer(compressedFile)

            const readerDataURL = new FileReader()
            readerDataURL.onload = (event) => {
              setShowImageSRC(event.target.result)
            }
            readerDataURL.readAsDataURL(compressedFile)
          },
        })
      } else {
        alert('Hanya gambar dengan extension yang diizinkan.')
        e.target.value = ''
        setImageUrl('')
        setShowImageSRC('') // Set empty string to showImageSRC
      }
    } else {
      setImageUrl('')
      setShowImageSRC('') // Set empty string to showImageSRC
    }
  }

  const handleImageClick = () => {
    inputImageRef.current.click()
  }

  const submitChangeProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (formData.notelp !== undefined && formData.notelp !== null) {
      if (formData.notelp.startsWith('0')) {
        toast.error('No Telp tidak valid, mohon mengganti angka 0 menjadi 62')
        return
      }

      if (!validatePhoneNumber(formData.notelp)) {
        toast.error('No Telp tidak valid')
        return
      }
    }

    const data = new FormData()
    if (formData.nama !== undefined && formData.nama !== null) {
      data.append('name', formData.nama)
    }

    if (formData.notelp !== undefined && formData.notelp !== null) {
      data.append('mobile', formData.notelp)
    }

    if (imageURL !== undefined && imageURL !== null) {
      data.append('image', imageURL)
    }

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PATH}${import.meta.env.VITE_API_TYPE_PRIVATE}/user/profile`,
      headers: { Authorization: `Bearer ${authToken}` },
      data: data,
    }

    try {
      const response = await axios.request(config)
      if (response.data.code === 200) {
        toast.success('Profil berhasil diperbarui')
        queryClient.invalidateQueries({ queryKey: ['dataProfile'] })
        setIsFormChanged(false)
      }
      console.log()
    } catch (error) {
      console.log(error)
    }
  }

  // SERIES API and FUNCTION CHANGE EMAIL

  const isEmailValid = (email: string) => {
    const emailRegex =
      /^([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])*)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])$/

    return emailRegex.test(email)
  }

  const handleEmailChange = (e: { target: { value: any } }) => {
    const { value } = e.target
    setFormData({ ...formData, email: value })
    setIsEmailChanged(true)
  }

  function checkIfExists(data: { email: any[] }) {
    if (
      data &&
      data?.email &&
      Array.isArray(data.email) &&
      data?.email?.length > 0
    ) {
      const existsStrings = data.email.filter((str: string | string[]) =>
        str.includes('exists'),
      )
      return existsStrings?.length > 0
    }
    return false
  }

  const submitEmailProfile = async () => {
    const data = new FormData()

    if (formData.email !== undefined && formData.email !== null) {
      data.append('email', formData.email)
    }

    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PATH}${import.meta.env.VITE_API_TYPE_PRIVATE}/user/profile`,
      headers: { Authorization: `Bearer ${authToken}` },
      data: data,
    }

    try {
      const response = await axios.request(config)
      if (response.data.code === 200) {
        setOtpEmail(null)
        setOTPFinal(null)
        setUserOTPInput(null)
        setPaymentDetailsVisibility(false)
        toast.success('Mohon Login Kembali', {
          duration: 1200,
        })
        setTimeout(() => {
          clearAllStorage()
          window.location.href = '/login'
        }, 1680)
        // queryClient.invalidateQueries({ queryKey: ['dataProfile'] })
        // setIsFormChanged(false)
      }
      console.log()
    } catch (error) {
      toast.error('Maaf Email belum bisa diperbarui')
    }
  }

  function decryptOtp(
    encryptedOtp: string | CryptoJS.lib.CipherParams,
    iv: string,
  ) {
    const key = import.meta.env.VITE_KEY_OTP
    const decipher = CryptoJS.AES.decrypt(
      encryptedOtp,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    )

    return decipher.toString(CryptoJS.enc.Utf8)
  }

  useEffect(() => {
    if (otpEmail) {
      const KODE_OTP = decryptOtp(otpEmail?.code, otpEmail?.key)
      setOTPFinal(KODE_OTP)
    }
  }, [otpEmail])

  const sendOTPtoEmail = async () => {
    try {
      // Request configuration
      const data = JSON.stringify({
        email: formData.email,
        name: profile?.data?.name,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PATH}${import.meta.env.VITE_API_TYPE_PUBLIC}/otp/email`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      // Making the request using axios with async/await
      const requestPromise = axios.request(config)

      toast.promise(
        requestPromise,
        {
          loading: 'Memproses Pengiriman OTP...',
          success: (response) => {
            if (response.data.code === 200 || response.data.code === '200') {
              setOtpEmail(response.data.data)
              setPaymentDetailsVisibility(true)
              // setShowCountdown(true)
              return 'Berhasil mengirim OTP'
            }
          },
          error: (error) => {
            setPaymentDetailsVisibility(false)
            return (
              error?.response?.data?.message ||
              'Maaf OTP tidak berhasil, email belum bisa untuk saat ini'
            )
          },
        },
        {
          success: {
            duration: 1900,
          },
          error: {
            duration: 4000,
          },
        },
      )
    } catch (error) {
      toast.error('Belum bisa mengubah email untuk saat ini')
    }
  }

  const checkExistingEmail = async () => {
    try {
      // Request configuration
      const data = JSON.stringify({
        email: formData.email,
        name: profile?.data?.name,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_PATH}${import.meta.env.VITE_API_TYPE_PUBLIC}/email/check`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      if (isEmailValid(formData.email)) {
        // Making the request using axios with async/await
        const response = await axios.request(config)
        // EMAIL INI BELUM DIGUNAKAN
        if (checkIfExists(response.data.data) === false) {
          setCountDownExist(true)
          sendOTPtoEmail()
          return
        } else {
          setIsEmailChanged(false)

          toast.error('Maaf Email ini sudah digunakan')
        }
      } else {
        toast.error('email anda tidak valid, mohon cek kembali')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (newValue: any) => {
    setUserOTPInput(newValue)
  }

  const handleComplete = () => {
    if (userOTPInput === OTPFinal) {
      setCountDownExist(false)
      submitEmailProfile()
    } else {
      toast.error('Kode OTP anda salah, Mohon cek kembali')
    }
  }

  type Countdown = {
    seconds: number
    completed: boolean
    showCountdown: boolean
  }

  type GenerateUlang = {
    handleResetCountdown: () => void
  }

  const ButtonGenerateUlang = ({ handleResetCountdown }: GenerateUlang) => {
    const handleClick = () => {
      sendOTPtoEmail()
      handleResetCountdown()
    }

    return (
      <div className="flex justify-center ">
        <button
          className="text-blue-800 rounded-md py-2 px-3 bg-blue-300/30"
          onClick={handleClick}
        >
          Kirim Ulang Kode OTP
        </button>
      </div>
    )
  }

  const BatalGantiPassword = () => {
    setOtpEmail(null)
    setOTPFinal(null)
    setUserOTPInput(null)
    setPaymentDetailsVisibility(false)
  }

  const CountdownComponent = ({
    seconds,
    completed,
    showCountdown,
  }: Countdown) => {
    const [resetCountdown, setResetCountdown] = useState(false)

    useEffect(() => {
      if (completed) {
        setResetCountdown(true)
      }
    }, [completed])

    const handleResetCountdown = () => {
      setResetCountdown(false)
    }

    return (
      <div>
        {resetCountdown && (
          <ButtonGenerateUlang handleResetCountdown={handleResetCountdown} />
        )}
        {!resetCountdown && showCountdown && (
          <Countdown
            date={Date.now() + seconds * 1000}
            onComplete={() => setResetCountdown(true)}
            renderer={({ seconds }) => (
              <div className="flex justify-center">
                <span className="">Kirim Ulang OTP dalam {seconds} detik </span>
              </div>
            )}
          />
        )}
      </div>
    )
  }

  return (
    <>
      {profile && (
        <Card
          extra={'w-full h-full pl-2 pr-6 md:px-6 pb-6 bg-cover mt-4 md:mt-5'}
        >
          <div className="container mx-2 mt-6">
            <div className="grid grid-cols-1 gap-0.5 md:gap-4 lg:grid-cols-3">
              {/* User information card */}
              <Card extra={'col-span-1'}>
                <div className="flex flex-col items-center justify-center rounded-lg bg-white p-5 dark:bg-navy-800 dark:shadow-white-900 h-[205px] md:h-[350px] ">
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={inputImageRef}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.svg"
                    />
                    <img
                      className="h-32 w-32 md:h--38 md:w-38 rounded-full"
                      src={showImageSRC || imageSrc}
                      alt="Profile picture"
                    />
                    <button
                      onClick={handleImageClick}
                      className="p-1 bg-white shadow absolute bottom-0 right-0 rounded-full"
                    >
                      <Image className="size-5" />
                    </button>
                  </div>
                  <h1 className="mt-4 text-xl font-bold">
                    {profile?.data?.name}
                  </h1>
                  {/* <span className="text-gray-600">Pelanggan Nethome</span> */}
                </div>
              </Card>
              <Card extra={'col-span-2 lg:col-span-2 mt-4 md:mt-0'}>
                {/* Form settings */}
                <form className="flex flex-col justify-between h-80 space-y-4 rounded-lg bg-white p-5 dark:bg-navy-800 dark:shadow-white-50">
                  {/* General Information */}
                  <div>
                    <h2 className="pb-8 text-2xl font-bold">Informasi Akun</h2>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-1">
                      <div>
                        <label htmlFor="nama" className="font-semibold">
                          Nama Lengkap
                        </label>
                        <input
                          name="nama"
                          id="nama"
                          className="w-full rounded border py-2 px-3 text-gray-700 shadow dark:!bg-navy-700 dark:shadow-none dark:text-white"
                          type="text"
                          placeholder="Masukkan Nama Depan"
                          value={formData.nama || profile?.data?.name}
                          onChange={handleNamaChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="no_telp" className="font-semibold">
                          No Telp
                        </label>
                        <input
                          name="no_telp"
                          id="no_telp"
                          className="w-full rounded border py-2 px-3 text-gray-700 shadow dark:!bg-navy-700 dark:shadow-none dark:text-white"
                          type="tel"
                          placeholder="Masukkan No Telp"
                          value={formData.notelp || profile?.data?.phone}
                          onChange={handlePhoneNumberChange}
                          onBlur={handlePhoneNumberChange}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className={`${isFormChanged === false ? 'hover:cursor-not-allowed bg-blue-500/65 hover:bg-blue-500' : 'bg-blue-600 hover:cursor-pointer'} rounded  py-2 px-4 text-white  `}
                    type="submit"
                    onClick={submitChangeProfile}
                    disabled={!isFormChanged}
                  >
                    Perbarui Akun
                  </button>
                </form>
              </Card>
            </div>
            <div className="pt-4 ">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>

              <div className="flex w-full space-x-4 pb-4">
                <input
                  name="email"
                  id="email"
                  className="w-2/3 md:w-5/6 rounded border py-2 px-3 text-gray-700 shadow dark:!bg-navy-700 dark:shadow-none dark:text-white"
                  type="text"
                  placeholder="Masukkan Email"
                  value={formData.email || profile?.data?.email}
                  onChange={handleEmailChange}
                />
                <button
                  className={`${isEmailChanged === false ? 'hover:cursor-not-allowed bg-blue-500/65 hover:bg-blue-500' : 'bg-blue-600 hover:cursor-pointer'} w-1/3 md:w-1/6 rounded   text-white  `}
                  type="submit"
                  onClick={checkExistingEmail}
                  disabled={!isEmailChanged}
                >
                  Ubah Email
                </button>
              </div>

              <div className="px-3 py-2 bg-red-300/30 border border-red-500 rounded text-red-800 text-sm">
                <p>
                  Catatan : Apabila melakukan perubahan email, maka diharuskan
                  login kembali.
                </p>
              </div>
            </div>
            <Transition
              as={Fragment}
              show={paymentDetailsVisibility} // Provide a default value
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-500/20  transition-opacity" />
                  </Transition.Child>

                  {/* Ini adalah jendela pop-up modal */}
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      {/* Konten dari pop-up detail pembayaran */}
                      <div className="bg-white dark:!bg-navy-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="text-center pt-8 pb-4 ">
                          <h3 className="text-xl font-bold ">
                            Masukkan Kode OTP
                          </h3>
                          <span>
                            Periksa OTP pada email yang dituju untuk pergantian
                          </span>
                        </div>
                        <div className="flex justify-center pb-8">
                          <OTPInput
                            maxLength={6}
                            inputMode="numeric"
                            // value={OTPFinal}
                            onChange={handleInputChange}
                            onComplete={handleComplete}
                            autoFocus={true}
                            containerClassName="group flex items-center has-[:disabled]:opacity-30"
                            render={({ slots }) => (
                              <>
                                <div className="flex">
                                  {slots.slice(0, 3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                  ))}
                                </div>

                                <FakeDash />

                                <div className="flex">
                                  {slots.slice(3).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                  ))}
                                </div>
                              </>
                            )}
                          />
                          {/* <p>ID Transaksi : {data?.payment_detail?.name}</p>
                          {data?.payment_detail.type === 'espay' && (
                            <>
                              <p className="font-semibold">
                                {data?.payment_detail.channel_id[1]}
                              </p>
                              <p>
                                Nomer VA:{' '}
                                {data?.payment_detail?.virtual_account}
                              </p>
                            </>
                          )}
                          {data?.payment_detail.type === 'qris' && (
                            <>
                              <p className="font-semibold">
                                Metode Pembayaran : QRIS
                              </p>
                              <p>
                                
                                <img
                                  src={`data:image/jpeg;base64,${data?.payment_detail?.qris_image}`}
                                  alt="qris image"
                                  className="max-w-[200px]"
                                />
                              </p>
                            </>
                          )}
                          <p>
                            Terbayar Pada :{' '}
                            {formatTanggalIndonesia(
                              data?.payment_detail.paid_datetime,
                            )}
                          </p> */}
                        </div>
                        {countDownExist ? (
                          // <Countdown
                          //   isPlaying={showCountdown && !resetCountdown}
                          //   date={dayjs().add(1, 'minute').toDate()}
                          //   renderer={renderer}
                          // ></Countdown>
                          <CountdownComponent
                            seconds={80}
                            completed={false}
                            showCountdown={true}
                          />
                        ) : (
                          <p className="text-center text-blue-800 bg-blueSecondary/10">
                            Login Kembali !
                          </p>
                        )}
                      </div>
                      <div className="bg-blue-500 px-4 py-2  sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="w-full inline-flex dark:bg-white dark:text-red-700 dark:hover:bg-whitesmoke dark:hover:text-brand-500 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={BatalGantiPassword}
                        >
                          Batalkan Perubahan Email
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Transition>
          </div>
        </Card>
      )}
    </>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-10 h-14 text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border border-y border-r first:border-1 first:rounded-l-md last:rounded-r-md',
        'group-hover:border-blue-500/20 group-focus-within:border-blue-500/20',
        'outline outline-0 outline-bluborder-blue-500/20',
        { 'outline-2 outline-blue-700 border-blue-500': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-blue-700" />
    </div>
  )
}

function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-border bg-blueSecondary" />
    </div>
  )
}

export default UserProfileSettings
