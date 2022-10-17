import { CheckCircleIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import React, { useEffect, useContext, useState } from 'react'

import { classNames } from '../utils/classNames';

export default function MissionUploadForm({ col }) {

	const [awaitingMissionDataMessage, setAwaitingMissionDataMessage] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [file, setFile] = useState()
	const [uploadProgress, setUploadProgress] = useState(0)


	function sendMissionToASM(filename) {
	}

	function handleChange(e) {
		setSuccess(false)
		setError("")
		setFile(e.target.files[0])
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setSuccess(false)
		if (!file) {
			setError("Select a mission file to upload")
			return
		}
		setAwaitingMissionDataMessage(true)
		let url = "https://" + window.location.host + '/todo'
		const formData = new FormData();
		formData.append('file', file);
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
		if (event.srcElement.status === 200) {
			const result = JSON.parse(event.srcElement.response)
			if (result.error) {
				setAwaitingMissionDataMessage(false)
				setUploadProgress(0)
				setError(result.error)
			} else if (result.file) {
				sendMissionToASM(result.file)
			}
		}
	}

	function abortHandler(event) {
		setError("Error: Cannot reach upload server")
		setAwaitingMissionDataMessage(false)
		setUploadProgress(0)
	}

	async function uploadFileFetchAPI(url, formData) {
		try {
			const resp = await fetch(url, { method: "POST", body: formData })
			const result = await resp.json()
			console.log(result);
			if (result.error) {
				setAwaitingMissionDataMessage(false)
				setError(result.error)
				return
			}
			if (result.file) {
				sendMissionToASM(result.file)
			}
		}
		catch (error) {
			setAwaitingMissionDataMessage(false)
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
								type="text"
								name="source"
								className="block w-full rounded-md py-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
					<label htmlFor="filepath" className="flex items-center text font-medium text-gray-700">
						JSON File
						<div className="mx-1 flex items-center pointer-events-none">
							{error && <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />}
							{success && <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />}
						</div>
					</label>
					<div className={col ? "" : "flex items-center"}>
						<div className="mt-1 mr-2 relative rounded-md shadow-sm">
							<input className={classNames("max-w-[18rem] block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 cursor-pointer focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
								"file:mr-4 file:py-2 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:text-gray-700 file:bg-gray-200 file:cursor-pointer")}
								type="file" onChange={handleChange} />
						</div>
						<button
							className={classNames(col ? "mt-3 float-right mr-3" : "", "ml-auto inline-flex action-button")}
							type="submit"
							disabled={awaitingMissionDataMessage}
						>
							Upload Mission
						</button>
					</div>
				</form>
				<div className='min-h-[20px] mt-2 text-sm'>
					{awaitingMissionDataMessage &&
						<div className={classNames(col ? "grid space-y-1" : 'flex items-center')}>
							<p className='mx-2 border-r pr-1'>{uploadProgress < 100 ? "Uploading " + uploadProgress + "%" : "Verifying..."}</p>
							<div className="mx-2 flex-auto bg-gray-300 h-2">
								<div className="bg-blue-600 h-2" style={{ width: `${uploadProgress}%` }}></div>
							</div>
						</div>
					}
					{success &&
						<p onClick={() => { setShowModal(true) }} className="text-blue-600 underline cursor-pointer inline">
							View
						</p>
					}
					{error &&
						<p className="text-red-600">
							{error}
						</p>
					}
				</div>
			</div>
		</>
	)
}