'use client'

import { FormEvent, useState } from 'react'

const interests = ['Understanding AKSOS', 'Exploring ATIS', 'Exploring an ecosystem or market', 'Research', 'Participation', 'Collaboration', 'Potential ATIS access', 'Something else']

export function InterestForm({ contactEmail = 'connect@atis.net' }: { contactEmail?: string }) {
  const [sent, setSent] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const selected = data.getAll('interest').join(', ')
    const body = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Organization: ${data.get('organization')}`, `Role / position: ${data.get('role')}`, `Country: ${data.get('country')}`, `Interests: ${selected}`, '', `${data.get('message')}`, '', `How they found us: ${data.get('source')}`].join('\n')
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('AKSOS interest')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  if (sent) return <div className="form-success" role="status"><span className="technical-note">AKSOS // MESSAGE QUEUED</span><h3>Thank you.</h3><p>Your message is ready in your email client. Send it to complete your introduction.</p></div>
  return <form className="interest-form" onSubmit={submit}>
    <div className="form-fields"><label>Name<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Organization<input name="organization" /></label><label>Role / position<input name="role" /></label><label>Country<input name="country" /></label><label>How did you find us?<input name="source" /></label></div>
    <fieldset><legend>What are you interested in?</legend><div className="interest-options">{interests.map((interest) => <label key={interest}><input type="checkbox" name="interest" value={interest} />{interest}</label>)}</div></fieldset>
    <label>Tell us more about what you&apos;re interested in.<textarea name="message" rows={5} required /></label>
    <button className="submit-button" type="submit">Send <span>→</span></button>
  </form>
}
