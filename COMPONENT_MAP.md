# Assignment 02 component map

This file is a development reference for the browser demonstration.

| Component | Reused on |
| --- | --- |
| `PrimaryButton` | Login, search, profile, booking, confirmation, rating |
| `InputField` | Login, search, booking |
| `TrustBadge` | Search results and business profile |
| `TrustSpotlight` | Search screen; third-party inspiration slot for 21st.dev |

## Props example for the video

The `Profile` flow passes the selected business from the parent `App` component into the profile UI through the `selected` value. The reusable `PrimaryButton` also receives props directly:

```jsx
<PrimaryButton onClick={() => go('booking')}>
  Book this business
</PrimaryButton>
```

`onClick` is the function prop passed from the parent. The child button calls it when the user clicks, which changes the screen in the parent state.
