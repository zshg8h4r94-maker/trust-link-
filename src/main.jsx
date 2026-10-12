import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, ShieldCheck, MapPin, CalendarDays, Clock3, Star, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, CreditCard, Sparkles } from 'lucide-react'
import './styles.css'

// Custom reusable component 1: used on Login, Search, Booking and Rating.
function PrimaryButton({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  return <button className={`button button-${variant}`} onClick={onClick} type={type} disabled={disabled}>{children}<ArrowRight size={17} /></button>
}

// Custom reusable component 2: used across every information-entry screen.
function InputField({ label, value, onChange, placeholder, icon: Icon, type = 'text' }) {
  return <label className="field"><span>{label}</span><div className="input-wrap">{Icon && <Icon size={18} />}<input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div></label>
}

// Custom reusable component 3: used on Search, Profile, Booking and Confirmation.
function TrustBadge({ children = 'Verified business' }) {
  return <span className="trust-badge"><ShieldCheck size={15} /> {children}</span>
}

// 21st.dev-inspired component integrated for this MVP: animated trust spotlight card.
function TrustSpotlight() {
  return <div className="spotlight"><div className="spotlight-icon"><Sparkles size={18} /></div><div><strong>Trust is built into every booking</strong><p>Reviews unlock only after a completed, paid booking.</p></div></div>
}

const businesses = [
  { id: 1, name: 'BrightPath Home Services', category: 'End-of-lease cleaning', location: 'Richmond, VIC', rating: '4.9', reviews: 38, price: '$45–60/hr', initials: 'BP', colour: 'coral' },
  { id: 2, name: 'Greenline Garden Care', category: 'Gardening and maintenance', location: 'Hawthorn, VIC', rating: '4.8', reviews: 24, price: '$50–70/hr', initials: 'GG', colour: 'sage' },
  { id: 3, name: 'SafeSpark Electrical', category: 'Minor electrical work', location: 'Fitzroy, VIC', rating: '4.7', reviews: 19, price: '$80–110/hr', initials: 'SE', colour: 'gold' },
]

function App() {
  const [screen, setScreen] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [service, setService] = useState('End-of-lease cleaning')
  const [suburb, setSuburb] = useState('Richmond')
  const [selected, setSelected] = useState(businesses[0])
  const [booking, setBooking] = useState({ date: '2026-10-03', time: '10:00 am', details: '' })
  const [paymentResult, setPaymentResult] = useState('success')
  const [rating, setRating] = useState(5)
  const [toast, setToast] = useState('')

  const go = next => { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const signIn = e => { e.preventDefault(); go('search') }
  const search = e => { e.preventDefault(); setToast(`Showing verified ${service.toLowerCase()} providers near ${suburb}`); setTimeout(() => setToast(''), 2500); go('results') }
  const submitBooking = async e => {
    e.preventDefault()

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: email,
          email: email,
          service: service,
          location: suburb,
          booking_date: booking.date
        })
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      setPaymentResult('success')
      go('confirmation')
    } catch (error) {
      console.error(error)
      setPaymentResult('error')
      go('confirmation')
    }
  }

  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => go('search')}><span className="brand-mark"><ShieldCheck size={20} /></span><span>Trust<span>Link</span></span></button><div className="topbar-right"><span className="pilot-tag">MVP pilot · Victoria</span>{screen !== 'login' && <button className="text-button" onClick={() => go('login')}>Sign out</button>}</div></header>
    <main>
      {screen === 'login' && <section className="auth-page"><div className="auth-copy"><p className="eyebrow">A safer way to hire locally</p><h1>Book with confidence.</h1><p className="lead">TrustLink connects you with verified local businesses and reviews from real completed bookings.</p><div className="auth-points"><div><ShieldCheck size={20} /><span><strong>Verification first</strong><small>ABN and licence checks are visible before you book.</small></span></div><div><Star size={20} /><span><strong>Reviews you can trust</strong><small>Only customers with completed bookings can rate.</small></span></div></div></div><form className="card auth-card" onSubmit={signIn}><div className="card-heading"><p className="eyebrow">Get started</p><h2>Create your account or log in</h2><p>Enter your email and password to create an account or log in.</p></div><InputField label="Email address" value={email} onChange={setEmail} placeholder="you@example.com" type="email" /><InputField label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" /><PrimaryButton type="submit">Create account or log in</PrimaryButton><p className="fine-print">By continuing, you agree to TrustLink's privacy notice and consent to the minimum information needed to manage your bookings.</p></form></section>}
      {screen === 'search' && <section className="page narrow"><div className="page-intro"><p className="eyebrow">Find a provider</p><h1>What do you need help with?</h1><p>Search verified local businesses by service and suburb.</p></div><TrustSpotlight /><form className="card form-card" onSubmit={search}><InputField label="Service type" value={service} onChange={setService} placeholder="e.g. cleaning, gardening" icon={Search} /><InputField label="Suburb or postcode" value={suburb} onChange={setSuburb} placeholder="e.g. Richmond" icon={MapPin} /><PrimaryButton type="submit">Search verified providers</PrimaryButton></form><div className="privacy-note"><ShieldCheck size={18} /><p><strong>Your search is private.</strong> TrustLink only uses your suburb to show nearby providers. It does not need your exact address at this stage.</p></div></section>}
      {screen === 'results' && <section className="page"><div className="page-intro row-intro"><div><p className="eyebrow">Search results</p><h1>Verified providers near {suburb}</h1><p>{businesses.length} businesses match “{service}”. Ranked by verified customer ratings.</p></div><button className="back-link" onClick={() => go('search')}><ArrowLeft size={16} /> Edit search</button></div><div className="results-grid">{businesses.map(b => <button className="business-card" key={b.id} onClick={() => { setSelected(b); go('profile') }}><div className={`avatar ${b.colour}`}>{b.initials}</div><div className="business-content"><div className="business-title"><h3>{b.name}</h3><TrustBadge /></div><p>{b.category} · {b.location}</p><div className="rating-line"><Star size={16} fill="currentColor" /> <strong>{b.rating}</strong> <span>({b.reviews} verified reviews)</span><span className="price">{b.price}</span></div></div><ArrowRight className="card-arrow" size={20} /></button>)}</div><div className="no-sponsored"><ShieldCheck size={18} /><span>No sponsored rankings. Verified ratings determine the order of results.</span></div></section>}
      {screen === 'profile' && <section className="page profile-page"><button className="back-link" onClick={() => go('results')}><ArrowLeft size={16} /> Back to results</button><div className="profile-hero"><div className={`avatar large ${selected.colour}`}>{selected.initials}</div><div><TrustBadge /><h1>{selected.name}</h1><p>{selected.category} · {selected.location}</p><div className="rating-line"><Star size={17} fill="currentColor" /><strong>{selected.rating}</strong><span>{selected.reviews} verified reviews</span></div></div><PrimaryButton onClick={() => go('booking')}>Book this business</PrimaryButton></div><div className="profile-grid"><div className="card profile-info"><h2>Why this business is verified</h2><div className="verification-row"><CheckCircle2 size={20} /><div><strong>ABN status checked</strong><p>Active registration verified by TrustLink.</p></div></div><div className="verification-row"><CheckCircle2 size={20} /><div><strong>Licence details checked</strong><p>Relevant credentials reviewed before listing.</p></div></div><div className="verification-row"><CheckCircle2 size={20} /><div><strong>Reviews linked to bookings</strong><p>Every rating comes from a completed platform booking.</p></div></div></div><div className="card review-card"><h2>Recent verified reviews</h2>{['Prompt arrival and excellent communication.', 'The work was completed exactly as quoted.', 'Easy to book and the result was professional.'].map((r, i) => <div className="review" key={r}><div className="review-top"><span>{'★'.repeat(5)}</span><small>{['2 weeks ago', '1 month ago', '2 months ago'][i]}</small></div><p>“{r}”</p><small>Linked to a verified booking</small></div>)}</div></div></section>}
      {screen === 'booking' && <section className="page narrow"><button className="back-link" onClick={() => go('profile')}><ArrowLeft size={16} /> Back to profile</button><div className="page-intro"><p className="eyebrow">Step 1 of 1 · Booking</p><h1>Book {selected.name}</h1><p>Choose a time and tell the provider what you need.</p></div><form className="card form-card" onSubmit={submitBooking}><InputField label="Preferred date" value={booking.date} onChange={v => setBooking({ ...booking, date: v })} type="date" icon={CalendarDays} /><InputField label="Preferred time" value={booking.time} onChange={v => setBooking({ ...booking, time: v })} placeholder="10:00 am" icon={Clock3} /><label className="field"><span>Job details <em>optional</em></span><textarea value={booking.details} onChange={e => setBooking({ ...booking, details: e.target.value })} placeholder="Briefly describe what you need done..." /></label><div className="payment-box"><div><CreditCard size={19} /><span><strong>Demo payment</strong><small>Your card will not be charged in this MVP.</small></span></div><span className="amount">$75.00</span></div><PrimaryButton type="submit">Confirm demo booking</PrimaryButton></form></section>}
      {screen === 'confirmation' && <section className="page narrow result-page"><div className={`result-icon ${paymentResult === 'success' ? 'success' : 'error'}`}>{paymentResult === 'success' ? <CheckCircle2 size={34} /> : <AlertCircle size={34} />}</div><p className="eyebrow">Booking status</p><h1>{paymentResult === 'success' ? 'Your booking is confirmed' : 'We could not confirm your booking'}</h1><p className="result-lead">{paymentResult === 'success' ? `${selected.name} has received your request for ${booking.date} at ${booking.time}.` : 'Please check your payment details and try again.'}</p><div className="card booking-summary"><div><span>Provider</span><strong>{selected.name}</strong></div><div><span>Service</span><strong>{service}</strong></div><div><span>Date and time</span><strong>{booking.date} · {booking.time}</strong></div><div><span>Reference</span><strong>TL-2026-1048</strong></div></div><div className="result-actions"><PrimaryButton onClick={() => go('rating')}>Rate after completion</PrimaryButton><button className="secondary-button" onClick={() => go('search')}>Return to search</button></div><p className="fine-print">Rating will unlock after the service is marked complete. This protects the integrity of TrustLink reviews.</p></section>}
      {screen === 'rating' && <section className="page narrow result-page"><div className="result-icon rating-icon"><Star size={34} fill="currentColor" /></div><p className="eyebrow">Verified booking review</p><h1>How was your experience?</h1><p className="result-lead">Your rating will be labelled as linked to a completed TrustLink booking.</p><div className="card rating-form"><div className="stars">{[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setRating(n)} className={n <= rating ? 'selected' : ''}><Star size={31} fill="currentColor" /></button>)}</div><p className="rating-label">{rating === 5 ? 'Excellent' : rating === 4 ? 'Very good' : rating === 3 ? 'Okay' : rating === 2 ? 'Needs improvement' : 'Poor'}</p><label className="field"><span>Share a few words <em>optional</em></span><textarea placeholder="What should other customers know?" /></label><PrimaryButton onClick={() => { setToast('Thanks — your verified review has been submitted'); setTimeout(() => setToast(''), 2500); go('search') }}>Submit verified rating</PrimaryButton></div></section>}
    </main>
    {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    <footer><span>TrustLink MVP</span><span>Designed for BUS4012 · Assessment 02</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
