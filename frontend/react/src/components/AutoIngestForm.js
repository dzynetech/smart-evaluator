import { useApolloClient, useQuery } from '@apollo/client';
import { CheckCircleIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import SOURCES_QUERY from '../queries/SourcesQuery';
import USER_QUERY from '../queries/UserQuery';
import { classNames } from '../utils/classNames';

export default function AutoIngestForm() {

	const [error, setError] = useState("")
	const [success, setSuccess] = useState(null)
	const [loading, setLoading] = useState(false)
	const [source, setSource] = useState("")
	const [url, setUrl] = useState("")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const client = useApolloClient()
	const { data: userData } = useQuery(USER_QUERY);

	async function handleSubmit(e) {
		e.preventDefault()
		setSuccess(false)
		setError(false)
		setLoading(true)
		let autoingest_url = "/autoingest" //"http://" + window.location.hostname + ":4199/ingest"
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			autoingest_url = "http://localhost:4199/autoingest"
		}
		url = addLimit(url)
		const data = { username, password, source, url: url }
		if (userData?.currentUser?.id) {
			data['user_id'] = userData.currentUser.id
		}

		try {
			const res = await fetch(autoingest_url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			const status = await res.json()
			setSuccess(status.success)
			setError(status.error)
		} catch (e){
			setError(e)
		}
		finally {
			setLoading(false)
			client.refetchQueries({include:[SOURCES_QUERY]})
		}
	}

	function addLimit(url_string) {
		const url= new URL(url_string)
		url.searchParams.set("limit",0)
		debugger
		return url.href
	}

	return (
		<>
			<div className='mx-auto max-w-[18rem]'>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="source" className="flex items-center text font-medium text-gray-700">
							URL
						</label>
						<div className="my-2">
							<input
								type="text" name="source" className="form-control"
								value={url}
								onChange={(e) => { setUrl(e.target.value) }}
							/>
						</div>
					</div>
					<div>
						<label htmlFor="username" className="flex items-center text font-medium text-gray-700">
							Username
						</label>
						<div className="my-2">
							<input
								type="text" name="username" className="form-control"
								value={username}
								onChange={(e) => { setUsername(e.target.value) }}
							/>
						</div>
					</div>
					<div>
						<label htmlFor="password" className="flex items-center text font-medium text-gray-700">
							Password
						</label>
						<div className="my-2">
							<input
								type="password" name="source" className="form-control"
								value={password}
								onChange={(e) => { setPassword(e.target.value) }}
							/>
						</div>
					</div>
					<div>
						<label htmlFor="source" className="flex items-center text font-medium text-gray-700">
							Source
						</label>
						<div className="my-2">
							<input
								type="text" name="source" className="form-control"
								value={source}
								onChange={(e) => { setSource(e.target.value) }}
							/>
						</div>
					</div>
					<div>
						<button
							className="btn btn-primary float-right mt-3"
							type="submit"
						>
							Import from URL
						</button>
					</div>
				</form>
				<div className='min-h-[20px] mt-2 text-sm'>
					<div className="mx-1 flex">
						{error && <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />}
						{success && <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />}
						<div className='mx-1 grid place-items-center'>
							{loading && <div class="flex justify-center items-center">
								<div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
								</div>
							</div>
							}
							{success && <p> {success}	</p>}
							{error && <p className="text-red-600"> {error} </p>}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}