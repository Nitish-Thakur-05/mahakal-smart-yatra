import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Eye, Star, Send, ArrowLeft, CheckCircle2, Compass, Sparkles, Shield, Info, Navigation, Calendar, Award, Share2, Heart, BookOpen, MessageSquare, User, Tag, ChevronRight, CornerDownRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Temple360Viewer } from '../components/Temple360Viewer';
import styles from '../styles/custom.module.css';

// Rich Editorial Blog Database for Avantika Shrines
const EDITORIAL_BLOG_DATABASE = {
  "shri-mahakaleshwar": {
    id: "shri-mahakaleshwar",
    title: "The Eternal Majesty of Shri Mahakaleshwar: A Comprehensive Devotional & Historical Guide",
    subtitle: "Discover the Puranic secrets, 3-tiered sanctum architecture, and sacred Bhasma Aarti rituals of Ujjain's sovereign Jyotirlinga.",
    author: "Avantika Vedic Heritage Board",
    authorRole: "Senior Temple Scholar",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    readTime: "7 min read",
    publishDate: "August 2026",
    category: "Jyotirlinga Heritage",
    location: "Mahakal Marg, Ujjain, Madhya Pradesh 456001",
    heroImage: "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1600",
    images: [
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200"
    ],
    introText: "Rising majestically on the banks of the sacred Shipra River in the ancient city of Ujjain, Shri Mahakaleshwar Temple stands as one of the most revered among the 12 Jyotirlingas of India. Unique in its cosmic orientation, Mahakal is the world's only south-facing (Dakshinamukhi) Jyotirlinga, symbolizing Lord Shiva's absolute mastery over time, death, and universal dissolution.",
    sections: [
      {
        heading: "1. Puranic Origins & The Legend of Dushan",
        content: "According to the Shiva Purana and Skanda Purana, Ujjain (ancient Avantika) was a flourishing center of Vedic wisdom governed by pious Brahmins. When the demon Dushan tormented the holy city, the devotees called upon Lord Shiva for protection. The earth parted, and Lord Shiva manifested in his fierce Mahakal form, annihilating the demon with a single roar. At the earnest prayer of his devotees, Shiva agreed to reside permanently in Avantika as the Dakshinamukhi Jyotirlinga."
      },
      {
        heading: "2. The Unique 3-Tiered Sanctum Architecture",
        content: "Unlike traditional single-level temples, Shri Mahakaleshwar features an extraordinary three-tiered architectural layout reflecting Bhumija and Maru-Gurjara structural excellence:\n\n• Base Tier (Garbhagriha): Houses the Swayambhu Lord Mahakaleshwar Jyotirlinga surrounded by silver pillars and oil lamps.\n• Middle Tier: Houses Lord Omkareshwar Mahadev worshipped daily for peace and prosperity.\n• Topmost Tier: Houses the extremely rare Nagchandreshwar idol, accessible to pilgrims only once a year on Nag Panchami."
      },
      {
        heading: "3. Sacred Daily Aarti Rituals & Timings",
        content: "The temple is globally renowned for its five daily Aarti ceremonies that punctuate the day with spiritual ecstasy:\n\n1. Bhasma Aarti (04:00 AM - 06:00 AM): The world-famous dawn ritual where fresh sacred ash is offered to the Lord.\n2. Naivedya Aarti (07:30 AM - 08:15 AM): Morning Panchamrit Snan and Vedic milk abhishek.\n3. Bhog Aarti (10:30 AM - 11:15 AM): Midday Rajopachara offering accompanied by Nagada drums.\n4. Sandhya Aarti (05:00 PM - 06:00 PM): Twilight camphor lighting with 108 oil lamps.\n5. Shayan Aarti (10:30 PM - 11:00 PM): Concluding peaceful night Aarti before sanctum doors close."
      },
      {
        heading: "4. Essential Devotee Gate & Dress Guidelines",
        content: "To maintain the sanctity of the Garbhagriha, strictly enforced guidelines apply:\n\n• Dress Code: Traditional Indian attire is required. Men entering the inner sanctum for Jalabhishek must wear a unstitched Dhoti/Solah, while women must wear a Saree or Salwar Kameez.\n• Gate Entry: Gate No. 1 serves VIP and Bhasma Aarti pass holders. Gate No. 4 serves general public queue lines leading to Nandi Hall.\n• Storage: Free footwear counters and locker facilities are provided outside Gate 4."
      }
    ],
    quote: "Avantika is recognized as the Nabhi Sthana (navel center) of Earth. Worshipping Mahakal here dissolves fear of death and bestows liberation.",
    travelInfo: {
      station: "Ujjain Junction Railway Station (2.1 km)",
      airport: "Devi Ahilyabai Holkar Airport, Indore (57 km)",
      transit: "E-Rickshaw (₹20/seat) & Free Temple Shuttle Buses from Trinetra Parking."
    },
    comments: [
      { user: "Dr. Arvind Shastri", date: "Aug 10, 2026", rating: 5, text: "An exceptional article detailing the spiritual depth of Mahakal. The 3-tier architectural breakdown is spot on." },
      { user: "Meenakshi Sundaram", date: "Aug 08, 2026", rating: 5, text: "Attended Bhasma Aarti last week. Reading this blog brought back the exact divine vibrations felt in Nandi Hall." }
    ]
  },
  "kal-bhairav": {
    id: "kal-bhairav",
    title: "Kal Bhairav Temple: The Tantric Guardian Commander of Ancient Avantika",
    subtitle: "Unveiling the sacred history, unique liquor offering rituals, and riverfront heritage of Ujjain's protective deity.",
    author: "Ujjain Heritage Research Cell",
    authorRole: "Historian & Cultural Analyst",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    readTime: "5 min read",
    publishDate: "August 2026",
    category: "Tantric Shrines",
    location: "Jail Road, Bhairav Garh, Ujjain 456003",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1600",
    images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200"],
    introText: "Situated in the historic Bhairav Garh sector along the banks of the sacred Shipra River, Kal Bhairav Temple is one of Ujjain's most visited and enigmatic shrines. Dedicated to Kal Bhairav—the fierce manifestation of Lord Shiva associated with protection—this temple plays an indispensable role in completing the Ujjain pilgrimage.",
    sections: [
      {
        heading: "1. The Guardian Deity of Avantika",
        content: "Mentioned prominently in the Skanda Purana, Kal Bhairav was appointed by Lord Shiva as the Senapati (Guardian Commander) of Avantika. According to tradition, no pilgrimage to Shri Mahakaleshwar is complete without seeking the blessings and protection of Lord Kal Bhairav."
      },
      {
        heading: "2. The World-Famous Liquor Offering Ritual",
        content: "The defining feature of Kal Bhairav temple is its ancient ritual where continuous offerings of liquor are presented to the deity. The priest pours the liquid into a small saucer and places it near the deity's stone lips; miraculously, the liquid vanishes right before the eyes of astonished devotees."
      },
      {
        heading: "3. Visitor & Travel Guidelines",
        content: "• Timings: Open daily from 05:00 AM to 10:00 PM.\n• Distance: Located 6.5 km from Ujjain Junction and 5 km from Mahakal Temple.\n• Local Transport: E-Rickshaws and taxis are readily available directly from Mahakal Temple Gate 4."
      }
    ],
    quote: "Kal Bhairav stands guard over the spiritual borders of Avantika, warding off negative energies and bestowing fearlessness.",
    travelInfo: {
      station: "Ujjain Junction (6.5 km)",
      airport: "Indore Airport (62 km)",
      transit: "Direct E-Rickshaw from Mahakal Temple (₹30-40)."
    },
    comments: [{ user: "Rajesh Varma", date: "Aug 05, 2026", rating: 5, text: "A fascinating read! Witnessing the offering ritual live is truly awe-inspiring." }]
  },
  "harsiddhi-mata": {
    id: "harsiddhi-mata",
    name: "Harsiddhi Mata Temple",
    title: "Harsiddhi Mata: The 51st Shaktipeeth & Twin Deepstambha Towers of King Vikramaditya",
    subtitle: "Exploring the divine abode where Goddess Sati's elbow fell, lit by 1,008 evening oil lamps.",
    author: "Shaktipeeth Study Circle",
    authorRole: "Devotional Scholar",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    readTime: "6 min read",
    publishDate: "August 2026",
    category: "Shaktipeeth Shrines",
    location: "Near Mahakal Temple, Ujjain 456001",
    heroImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1600",
    images: ["https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1200"],
    introText: "Just a short five-minute walk from Shri Mahakaleshwar Temple lies Harsiddhi Mata Temple, one of the sacred 51 Shaktipeeths of India. According to mythology, when Lord Vishnu used his Sudarshana Chakra to dismember the body of Sati, her right elbow fell at this holy spot.",
    sections: [
      {
        heading: "1. King Vikramaditya's Devotional Legacy",
        content: "Legend recounts that the legendary King Vikramaditya worshipped Goddess Harsiddhi as his Kuldevi (family deity). He offered his head eleven times at her altar, and each time the compassionate Goddess restored his life, granting him extraordinary wisdom and ruler sovereignty."
      },
      {
        heading: "2. The Spectacle of Twin 51-Foot Deepstambha Towers",
        content: "The temple courtyard features two magnificent 51-foot tall stone lamp towers (Deepstambha) dating back to the Maratha era. During evening Sandhya Aarti, brave lamp-lighters scale these towers to light over 1,008 oil lamps, casting a golden divine glow across the sky."
      }
    ],
    quote: "The twilight illumination of Harsiddhi Deepstambha towers is a divine spectacle connecting earthly devotion to celestial light.",
    travelInfo: {
      station: "Ujjain Junction (2.5 km)",
      airport: "Indore Airport (58 km)",
      transit: "5-minute walk from Mahakal Temple Gate 4."
    },
    comments: [{ user: "Ananya Iyer", date: "Aug 02, 2026", rating: 5, text: "The evening Deepstambha lighting ritual described in this blog is the highlight of Ujjain!" }]
  }
};

export function TempleDetail() {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ user: '', rating: 5, comment: '' });
  const [comments, setComments] = useState([]);
  const [show360Modal, setShow360Modal] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchTemple() {
      try {
        const res = await axios.get(`/api/temples/${id}`);
        const blogData = EDITORIAL_BLOG_DATABASE[id] || EDITORIAL_BLOG_DATABASE["shri-mahakaleshwar"];
        
        if (res.data) {
          setTemple({ ...blogData, ...res.data });
          setComments(res.data.reviews || blogData.comments || []);
        } else {
          setTemple(blogData);
          setComments(blogData.comments || []);
        }
      } catch (err) {
        console.warn("Using editorial blog record for ID:", id);
        const blogData = EDITORIAL_BLOG_DATABASE[id] || EDITORIAL_BLOG_DATABASE["shri-mahakaleshwar"];
        setTemple(blogData);
        setComments(blogData.comments || []);
      } finally {
        setLoading(false);
      }
    }
    fetchTemple();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.user.trim() || !newComment.comment.trim()) {
      toast.error("Please fill in your name and comment.");
      return;
    }

    try {
      const res = await axios.post(`/api/temples/${id}/review`, newComment);
      setComments(res.data.reviews || []);
      setNewComment({ user: '', rating: 5, comment: '' });
      toast.success("Thank you! Your comment has been published.");
    } catch (err) {
      console.error(err);
      const updated = [...comments, { user: newComment.user, rating: newComment.rating, comment: newComment.comment, date: "Just now" }];
      setComments(updated);
      setNewComment({ user: '', rating: 5, comment: '' });
      toast.success("Thank you! Your comment has been added.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: temple?.title || temple?.name,
        text: temple?.subtitle || temple?.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="py-5 bg-black min-vh-100 text-white d-flex align-items-center justify-content-center pt-5">
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status" />
          <p className="text-warning font-monospace small">Loading Heritage Editorial Article...</p>
        </div>
      </div>
    );
  }

  const blogData = temple || EDITORIAL_BLOG_DATABASE["shri-mahakaleshwar"];
  const imageGallery = blogData.images && blogData.images.length > 0 ? blogData.images : [blogData.heroImage || blogData.image];

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container max-w-1100 py-3">
        
        {/* Blog Top Breadcrumb Navigation */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
          <Link to="/temples" className="text-warning text-decoration-none d-inline-flex align-items-center font-semibold hover-gold">
            <ArrowLeft size={18} className="me-2 text-warning" /> Back to All Heritage Articles
          </Link>

          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5 ${isSaved ? 'btn-danger text-white' : 'btn-outline-secondary text-light'}`}
            >
              <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
              <span className="small">{isSaved ? "Saved Article" : "Save Article"}</span>
            </button>

            <button 
              onClick={handleShare}
              className="btn btn-outline-warning btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5"
            >
              <Share2 size={14} />
              <span className="small">Share Article</span>
            </button>
          </div>
        </div>

        {/* BLOG POST ARTICLE HEADER */}
        <article className="mb-5">
          <div className="mb-3">
            <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill uppercase tracking-wider small me-2">
              <BookOpen size={13} className="me-1" /> {blogData.category || "Vedic Heritage Blog"}
            </span>
            <span className="text-secondary font-monospace small">
              <Clock size={13} className="me-1 text-warning" /> {blogData.readTime || "6 min read"} • {blogData.publishDate || "August 2026"}
            </span>
          </div>

          <h1 className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`} style={{ lineHeight: 1.25 }}>
            {blogData.title || blogData.name}
          </h1>

          <p className="lead text-light fs-5 mb-4" style={{ lineHeight: 1.6, color: '#e0e0e0' }}>
            {blogData.subtitle || blogData.tagline || blogData.description}
          </p>

          {/* Author Byline Box */}
          <div className="d-flex align-items-center justify-content-between p-3.5 bg-dark rounded-4 border border-warning border-opacity-30 mb-4 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <img 
                src={blogData.authorAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"} 
                alt="Author" 
                className="rounded-circle border border-warning"
                style={{ width: 48, height: 48, objectFit: 'cover' }}
              />
              <div>
                <span className="text-white fw-bold d-block small mb-0">{blogData.author || "Avantika Vedic Heritage Board"}</span>
                <small className="text-warning font-monospace" style={{ fontSize: '0.75rem' }}>{blogData.authorRole || "Senior Temple Scholar"}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button 
                onClick={() => setShow360Modal(true)}
                className={`btn ${styles.goldBtn} btn-sm rounded-pill px-3 py-2 font-monospace fw-bold d-flex align-items-center gap-1.5 shadow`}
              >
                <Compass size={16} /> 360° Virtual Tour
              </button>
            </div>
          </div>

          {/* Editorial Hero Feature Image */}
          <div className="rounded-4 overflow-hidden position-relative border border-warning border-opacity-30 shadow-2xl mb-5" style={{ height: '480px' }}>
            <img 
              src={imageGallery[selectedImageIdx] || blogData.heroImage} 
              alt={blogData.name} 
              className="w-100 h-100 object-fit-cover" 
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-black bg-opacity-80 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
              <span className="text-warning small font-monospace d-flex align-items-center gap-1">
                <MapPin size={14} /> {blogData.location}
              </span>
              <span className="text-secondary small font-monospace">
                Photo 1 of {imageGallery.length} • Avantika Kshetra Gallery
              </span>
            </div>
          </div>

          {/* Main Layout: Left Article Body (70%) & Right Sticky Sidebar (30%) */}
          <div className="row g-5">
            
            {/* LEFT: EDITORIAL BLOG CONTENT */}
            <div className="col-lg-8">
              
              {/* Introduction Lead Paragraph with Drop Cap */}
              <div className="blog-content text-light fs-5 mb-5" style={{ lineHeight: 1.8 }}>
                <p className="mb-4">
                  <span className="float-start display-3 fw-bold text-warning pe-3 lh-1 font-serif">
                    {(blogData.introText || blogData.description || "R")[0]}
                  </span>
                  {(blogData.introText || blogData.description).slice(1)}
                </p>
              </div>

              {/* Puranic Quote Callout Box */}
              <div className="p-4 my-5 bg-black rounded-4 border-start border-warning border-4 text-white shadow">
                <Sparkles size={24} className="text-warning mb-2" />
                <blockquote className="blockquote mb-2 italic fs-5 text-warning font-serif" style={{ lineHeight: 1.5 }}>
                  "{blogData.quote || "Worshipping Lord Mahakal in Avantika dissolves fear of death and bestows liberation."}"
                </blockquote>
                <figcaption className="blockquote-footer text-secondary font-monospace small mb-0">
                  Ref: Skanda Purana • Avantika Kshetra Mahatmya
                </figcaption>
              </div>

              {/* Editorial Sections Loop */}
              {(blogData.sections || []).map((sec, idx) => (
                <div key={idx} className="mb-5">
                  <h3 className={`text-warning fw-bold mb-3 ${styles.playfairFont}`} style={{ fontSize: '1.6rem' }}>
                    {sec.heading}
                  </h3>
                  <div className="text-light small-lead mb-4" style={{ lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                    {sec.content}
                  </div>
                </div>
              ))}

              {/* INLINE 360° VIRTUAL TOUR BANNER */}
              <div className="p-4 my-5 rounded-4 bg-gradient-to-r from-dark to-black border border-warning border-opacity-40 text-center shadow-lg">
                <div className="rounded-circle bg-warning text-dark mx-auto p-3 d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: 64, height: 64 }}>
                  <Compass size={32} />
                </div>
                <h4 className={`text-warning fw-bold mb-2 ${styles.playfairFont}`}>
                  Experience 360° Virtual Darshan
                </h4>
                <p className="text-secondary max-w-500 mx-auto small mb-4">
                  Rotate 360 degrees around the sanctum sanctorum of {blogData.name} with audio mantras and spiritual hotspots.
                </p>
                <button
                  onClick={() => setShow360Modal(true)}
                  className={`btn ${styles.goldBtn} py-3 px-5 fw-bold font-monospace shadow`}
                >
                  <Compass size={18} className="me-2" /> Open 360° Panoramic Viewer
                </button>
              </div>

              {/* DEVOTEE COMMENTS & REVIEWS SECTION */}
              <div className="pt-5 border-top border-secondary border-opacity-25 mt-5">
                <h4 className={`text-warning fw-bold mb-4 d-flex align-items-center gap-2 ${styles.playfairFont}`}>
                  <MessageSquare size={22} /> Devotee Comments & Experiences ({comments.length})
                </h4>

                {/* Comment Submission Form */}
                <div className="p-4 bg-dark rounded-4 border border-secondary border-opacity-25 mb-4 shadow">
                  <h6 className="text-white fw-bold mb-3">Leave a Devotional Comment</h6>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary small">Your Name</label>
                        <input 
                          type="text" 
                          className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                          placeholder="e.g. Anand Kumar"
                          required
                          value={newComment.user}
                          onChange={(e) => setNewComment({ ...newComment, user: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-secondary small">Rating</label>
                        <select 
                          className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                          value={newComment.rating}
                          onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                        >
                          <option value={5}>5 Stars - Divine Experience</option>
                          <option value={4}>4 Stars - Very Good</option>
                          <option value={3}>3 Stars - Satisfactory</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-secondary small">Your Experience / Comment</label>
                      <textarea 
                        className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                        rows={3}
                        placeholder="Share your spiritual thoughts, Aarti memories, or guidance for pilgrims..."
                        required
                        value={newComment.comment}
                        onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                      />
                    </div>

                    <button type="submit" className={`btn ${styles.goldBtn} py-2.5 px-4 font-semibold font-monospace`}>
                      <Send size={15} className="me-1.5 d-inline" /> Post Comment
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <div className="d-flex flex-column gap-3">
                  {comments.map((c, idx) => (
                    <div key={idx} className="p-3.5 bg-black rounded-3 border border-secondary border-opacity-25">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-warning text-dark fw-bold small d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            {c.user[0]}
                          </div>
                          <span className="fw-bold text-warning small">{c.user}</span>
                        </div>
                        <div className="text-warning small">
                          {'★'.repeat(c.rating || 5)}
                        </div>
                      </div>
                      <p className="text-light small mb-0 ms-4 ps-2" style={{ lineHeight: 1.5 }}>
                        {c.comment || c.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT STICKY SIDEBAR */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '100px' }}>
                
                {/* Shrine Specifications Card */}
                <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-30 mb-4 shadow">
                  <h6 className="text-warning font-monospace fw-bold text-uppercase mb-3 d-flex align-items-center gap-1.5">
                    <Info size={16} /> Shrine Quick Facts
                  </h6>

                  <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li className="pb-2.5 border-bottom border-secondary border-opacity-25">
                      <small className="text-secondary d-block font-monospace" style={{ fontSize: '0.73rem' }}>LOCATION</small>
                      <span className="text-white small font-semibold">{blogData.location}</span>
                    </li>
                    <li className="pb-2.5 border-bottom border-secondary border-opacity-25">
                      <small className="text-secondary d-block font-monospace" style={{ fontSize: '0.73rem' }}>DARSHAN TIMINGS</small>
                      <span className="text-white small font-semibold">{blogData.timings || "04:00 AM - 11:00 PM Daily"}</span>
                    </li>
                    <li className="pb-2.5 border-bottom border-secondary border-opacity-25">
                      <small className="text-secondary d-block font-monospace" style={{ fontSize: '0.73rem' }}>ENTRY GATES</small>
                      <span className="text-white small font-semibold">Gate 1 (VIP/Pass) & Gate 4 (General)</span>
                    </li>
                    <li className="pb-2.5 border-bottom border-secondary border-opacity-25">
                      <small className="text-secondary d-block font-monospace" style={{ fontSize: '0.73rem' }}>PRIMARY DEITY</small>
                      <span className="text-white small font-semibold">Swayambhu South-Facing Lingam</span>
                    </li>
                  </ul>

                  <Link to="/aarties" className={`w-100 btn ${styles.goldBtn} py-2.5 mt-4 text-center font-monospace fw-bold small text-decoration-none`}>
                    Reserve Aarti Pass
                  </Link>
                </div>

                {/* Travel & Access Summary */}
                <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 mb-4 shadow">
                  <h6 className="text-warning font-monospace fw-bold text-uppercase mb-3 d-flex align-items-center gap-1.5">
                    <Navigation size={16} /> Pilgrim Travel Guide
                  </h6>
                  <p className="text-light small mb-2">
                    <strong>Nearest Train:</strong> Ujjain Junction (2.1 km)
                  </p>
                  <p className="text-light small mb-2">
                    <strong>Nearest Airport:</strong> Indore Airport (57 km)
                  </p>
                  <p className="text-secondary small mb-0">
                    <strong>Local Transit:</strong> Free temple shuttle buses from Trinetra Parking.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </article>

        {/* 360° Virtual Darshan Modal */}
        {show360Modal && (
          <Temple360Viewer 
            templeId={blogData.id || "shri-mahakaleshwar"}
            onClose={() => setShow360Modal(false)}
          />
        )}
      </div>
    </div>
  );
}
