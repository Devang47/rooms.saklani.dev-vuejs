import { useLoadingStore } from '@/stores/global'
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage'
import { app } from './config'
import { addNotification } from './notifications'
import CryptoJS from 'crypto-js'

export const uploadFile = (roomId: string, file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex)
    const { setLoadingValue } = useLoadingStore()

    const storage = getStorage(app)
    const storageRef = ref(
      storage,
      cryptedKey + '/' + CryptoJS.SHA256(file.name).toString(CryptoJS.enc.Hex)
    )

    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 204857600) {
          uploadTask.cancel()
          setLoadingValue(false)

          addNotification('File size exceeds 20mb limit!', true)
          return
        }
      },
      (error) => {
        setLoadingValue(false)
        addNotification('Error while uploading file!', true)
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (e: string) => {
          setLoadingValue(false)
          resolve(e)
        })
      }
    )
  })

export const minifyURL = async (e: string) =>
  new Promise((resolve, reject) => {
    const data = {
      url: e,
      domain: 'tiny.one'
    }

    fetch('https://api.tinyurl.com/create', {
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
        authorization: `Bearer ${import.meta.env.VITE_SHORTIO_API_KEY}`
      },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        resolve(data.data.tiny_url)
      })
      .catch((e) => reject(e))
  })
