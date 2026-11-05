const paths = {
  code: (
    <>
      <path d="M8.5 7.2 L3.6 12.1 L8.7 16.9" />
      <path d="M15.6 7 L20.5 12.2 L15.4 17" />
      <path d="M13.6 4.8 L10.4 19.3" />
    </>
  ),
  heart: (
    <path d="M12 20.2 C6 15.6 3.4 12.6 3.6 9.2 C3.8 6.2 7.4 5 9.6 7 C10.6 7.9 11.5 8.8 12 9.8 C12.7 8.4 13.6 7.7 14.6 7.1 C17 5.8 20.4 7.2 20.4 10.2 C20.4 13.2 17.6 16.2 12 20.2Z" />
  ),
  palette: (
    <>
      <path d="M12 3.6 C6.8 3.4 3 7.2 3.2 12 C3.4 16.6 7.6 20.4 12.4 20.2 C14.6 20.1 14.8 18.2 13.6 17 C12.6 16 13 14.4 14.6 14.4 L17.2 14.4 C19.6 14.4 20.8 12.6 20.8 10.8 C20.6 6.6 16.8 3.8 12 3.6Z" />
      <circle cx="8" cy="10.4" r="1" />
      <circle cx="11.6" cy="7.6" r="1" />
      <circle cx="16" cy="8.4" r="1" />
    </>
  ),
  mail: (
    <>
      <path d="M3.6 6.4 L20.4 6.2 L20.6 17.6 L3.4 17.8Z" />
      <path d="M3.8 6.8 L12 13 L20.2 6.6" />
    </>
  ),
  branch: (
    <>
      <circle cx="7" cy="5.5" r="2.3" />
      <circle cx="7" cy="18.5" r="2.3" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M7 7.8 V16.2" />
      <path d="M17 10.8 C17 14.2 11.5 13.2 8.6 17" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20 C5.4 15.4 8.4 13.6 12 13.6 C15.6 13.6 18.6 15.4 19 20" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.2 L8 8 L9.4 5.8 L14.6 5.9 L16 8 L20 8.2 L20.2 18.4 L3.8 18.6Z" />
      <circle cx="12" cy="13.2" r="3.3" />
    </>
  ),
  yarn: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M5.2 9 C9 11.2 14 11 18.8 8.4" />
      <path d="M4.4 13.6 C9 16 15 15.6 19.6 12.6" />
      <path d="M9 4.4 C8 9 10 15 14 19.6" />
      <path d="M17 18.6 C19.4 19.8 20.8 19.4 21.6 20.6" />
    </>
  ),
};

export default function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}