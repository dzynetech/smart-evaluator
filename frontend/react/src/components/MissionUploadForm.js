import { useQuery } from '@apollo/client';
import { CheckCircleIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import React, { useEffect, useContext, useState } from 'react'
import USER_QUERY from '../queries/UserQuery';

import { classNames } from '../utils/classNames';

export default function MissionUploadForm({ col }) {

	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [file, setFile] = useState()
	const [uploadProgress, setUploadProgress] = useState(0)
	const [source, setSource] = useState("")

  const { data: userData} = useQuery(USER_QUERY);


	function handleChange(e) {
		setSuccess(false)
		setError("")
		setFile(e.target.files[0])
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setSuccess(false)
		setError(false)
		if (!file) {
			setError("Select a mission file to upload")
			return
		}
		setUploading(true)
		let url = "http://127.0.0.1:5000/ingest"
		const formData = new FormData();
		formData.append('file', file);
		formData.append('source',source)
		if (userData?.currentUser?.id) {
			formData.append('user_id',userData.currentUser.id)
		}
		// await uploadFileFetchAPI(url, formData)
		uploadFileAjaxAPI(url, formData)
	}

	function uploadFileAjaxAPI(url, formData) {
		const ajax = new XMLHttpRequest();
		ajax.upload.addEventListener("progress", progressHandler, false);
		ajax.addEventListener("load", completeHandler, false);
		ajax.addEventListener("error", abortHandler, false);
		ajax.addEventListener("abort", abortHandler, false);
		ajax.open("POST", url);
		ajax.send(formData);
	}

	function progressHandler(event) {
		var percent = (event.loaded / event.total) * 100;
		setUploadProgress(Math.round(percent))
	}

	function completeHandler(event) {
		setUploading(false)
		if (event.srcElement.status === 200) {
			const result = JSON.parse(event.srcElement.response)
			if (result.error) {
				setUploadProgress(0)
				setError(result.error)
			} else if (result.success) {
				setSuccess(result.success)	
			}
		}
	}

	function abortHandler(event) {
		setError("Error: Cannot reach upload server")
		setUploading(false)
		setUploadProgress(0)
	}

	async function uploadFileFetchAPI(url, formData) {
		try {
			const resp = await fetch(url, { method: "POST", body: formData })
			const result = await resp.json()
			console.log(result);
			if (result.error) {
				setUploading(false)
				setError(result.error)
				return
			}
			if (result.file) {
				// sendMissionToASM(result.file)
			}
		}
		catch (error) {
			setUploading(false)
			if (error instanceof TypeError) {
				setError("Error: Cannot reach upload server")
			} else {
				setError("Error: " + error)
			}
		}
	}


	return (
		<>
			<div>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="source" className="flex items-center text font-medium text-gray-700">
						Source
						</label>
						<div className="mt-1">
							<input
								type="text" name="source" className="form-control"
								value={source}
								onChange={(e)=>{setSource(e.target.value)}}
							/>
						</div>
					</div>
					<label htmlFor="filepath" className="flex items-center text font-medium text-gray-700">
						JSON File
					</label>
					<div className={col ? "" : "flex items-center"}>
						<div className="mt-1 mr-2 relative rounded-md shadow-sm">
							<input className={classNames("max-w-[18rem] block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 cursor-pointer focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
								"file:mr-4 file:py-2 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:text-gray-700 file:bg-gray-200 file:cursor-pointer")}
								type="file" onChange={handleChange} />
						</div>
						<button
							className="btn btn-primary float-right mt-2"
							type="submit"
						>
							Upload Mission
						</button>
					</div>
				</form>
				<div className='min-h-[20px] mt-2 text-sm'>
					{uploading && 
						<div className={classNames(col ? "grid space-y-1" : 'flex items-center')}>
							<p className='mx-2 border-r pr-1'>{uploadProgress < 100 ? "Uploading " + uploadProgress + "%" : "Verifying..."}</p>
							<div className="mx-2 flex-auto bg-gray-300 h-2">
								<div className="bg-blue-600 h-2" style={{ width: `${uploadProgress}%` }}></div>
							</div>
						</div>
					}
						<div className="mx-1 flex items-center pointer-events-none">
							{error && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
							{success && <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />}
							<div className='grid place-items-center'>
								{success && <p> {success}	</p> }
								{error && <p className="text-red-600"> {error} </p> }
							</div>
						</div>
				</div>
			</div>
		</>
	)
}