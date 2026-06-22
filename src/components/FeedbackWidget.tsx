import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Star, CheckCircle } from 'lucide-react';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!message.trim() && rating === 0) return;
    // In a real app, this would POST to an API endpoint
    console.log('[Feedback]', { rating, message });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setRating(0);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-80 rounded-2xl shadow-2xl overflow-hidden theme-card theme-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b theme-border bg-gradient-to-r from-cyan-600 to-indigo-600 text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Send Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close feedback"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 gap-3"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <p className="font-bold theme-text">Thank you!</p>
                  <p className="text-sm theme-text-muted">Your feedback helps us improve.</p>
                </motion.div>
              ) : (
                <>
                  {/* Star rating */}
                  <div>
                    <p className="text-sm font-medium theme-text mb-2">Rate your experience</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="feedback-msg" className="text-sm font-medium theme-text block mb-2">
                      Your feedback
                    </label>
                    <textarea
                      id="feedback-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you think..."
                      className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-all theme-input theme-border border focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() && rating === 0}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                      ${!message.trim() && rating === 0
                        ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                        : 'btn-gradient text-white'
                      }`}
                  >
                    <Send className="w-4 h-4" /> Submit Feedback
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all
          ${isOpen
            ? 'bg-gray-500 text-white'
            : 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
          }`}
        aria-label={isOpen ? 'Close feedback' : 'Open feedback'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
