import React, { useState, FormEvent } from 'react';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

export const RequestForm = () => {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState<SubmitState>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!request.trim() || status === 'sending') return;

    setStatus('sending');
    try {
      const body = new URLSearchParams({
        'form-name': 'algorithm-requests',
        name: name.trim() || 'Anonymous',
        request: request.trim(),
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error('submit failed');
      setStatus('sent');
      setName('');
      setRequest('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="request-card">
      <h2 className="section-label">Request an algorithm</h2>

      {status === 'sent' ? (
        <p className="request-thanks" role="status">
          Thanks — your request was sent.
        </p>
      ) : (
        <form
          className="request-form"
          name="algorithm-requests"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value="algorithm-requests" />
          <input
            className="bot-field"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label className="field">
            <span>Name (optional)</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              maxLength={80}
            />
          </label>

          <label className="field">
            <span>Algorithm idea</span>
            <textarea
              name="request"
              value={request}
              onChange={(e) => {
                setRequest(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="e.g. Jump Point Search, Bellman-Ford, swarm…"
              rows={4}
              required
              maxLength={500}
            />
          </label>

          {status === 'error' && (
            <p className="request-error" role="alert">
              Couldn&apos;t send that — try again in a moment.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!request.trim() || status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send request'}
          </button>
        </form>
      )}
    </section>
  );
};
