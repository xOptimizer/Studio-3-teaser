import { useEffect, useState } from 'react';
import { fetchTickets, downloadTicketPdf } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const MyTicketsPage = ({ onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      onNavigate('/');
      return;
    }

    fetchTickets()
      .then((data) => setTickets(data.tickets || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, onNavigate]);

  const handleDownload = async (ticketId) => {
    setDownloadingId(ticketId);
    try {
      const blob = await downloadTicketPdf(ticketId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${ticketId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-[120px] px-4 flex items-center justify-center">
        <p className="text-gray-500">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[120px] pb-24 px-4 sm:px-6" style={{ background: '#F7F7F7' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold text-black mb-2">My Tickets</h1>
        <p className="text-gray-500 text-sm mb-8">Signed in as {user?.email}</p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        {tickets.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
            No tickets yet.{' '}
            <button onClick={() => onNavigate('/event')} className="text-orange-600 font-bold">
              Browse events
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-black">{ticket.event.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{ticket.event.venue}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(ticket.event.startsAt).toLocaleString()}
                    </p>
                    <p className="text-sm mt-3">
                      <span className="text-gray-500">Attendee:</span>{' '}
                      <span className="font-semibold">{ticket.attendeeName}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Confirmation:</span>{' '}
                      <span className="font-mono font-bold">{ticket.confirmationCode}</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">Status:</span>{' '}
                      <span
                        className={
                          ticket.status === 'valid'
                            ? 'text-emerald-600 font-bold'
                            : 'text-gray-600 font-bold'
                        }
                      >
                        {ticket.status}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(ticket.id)}
                    disabled={downloadingId === ticket.id}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                  >
                    {downloadingId === ticket.id ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
