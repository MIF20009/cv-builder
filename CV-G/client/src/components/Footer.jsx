import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer sm:footer-horizontal p-10">
        <nav>
          <h6 className="footer-title">CV Tools</h6>
          <a className="link link-hover">AI CV Generator</a>
          <a className="link link-hover">Preview & Download</a>
          <a className="link link-hover">Export to PDF</a>
        </nav>

        <nav>
          <h6 className="footer-title">Student-X</h6>
          <a className="link link-hover">About Project</a>
          <a className="link link-hover">Our Mission</a>
          <a className="link link-hover">Partners</a>
        </nav>

        <nav>
          <h6 className="footer-title">Support</h6>
          <a className="link link-hover">Help Center</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Terms & Conditions</a>
        </nav>

        <form>
          <h6 className="footer-title">Stay Updated</h6>
          <fieldset className="w-80">
            <label htmlFor="email">Enter your email address</label>
            <div className="join">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="input input-bordered join-item"
              />
              <button className="btn btn-primary join-item">Subscribe</button>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="text-center p-4 text-sm border-t border-base-300">
        © {new Date().getFullYear()} Student-X.com — All rights reserved
      </div>
    </footer>
  )
}

export default Footer
