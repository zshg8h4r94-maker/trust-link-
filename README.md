# TrustLink MVP

Front-end MVP for BUS4012 Assessment 02. It demonstrates the TrustLink trust mechanic: verified local businesses, booking-gated reviews, and clear verification signals.

## Run locally

```bash
npm install
npm run dev
```

The MVP uses simulated business data and demo payment. It does not store permanent user data.

## Reusable components

- `PrimaryButton`: reused on login, search, profile, booking, confirmation and rating.
- `InputField`: reused on login, search and booking.
- `TrustBadge`: reused on search results and business profile.

## Third-party component

`TrustSpotlight` is the 21st.dev-inspired spotlight card used on the search screen. For the assignment workflow, replace or document it alongside the exact 21st.dev copied component prompt used in Cline.
