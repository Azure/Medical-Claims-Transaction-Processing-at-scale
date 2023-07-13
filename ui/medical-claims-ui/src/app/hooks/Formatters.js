import moment from 'moment';

const FormatDate = (dateString) => {
  const formats = [
    "YYYY-MM-DDTHH:mm:ssZ", // First format to try
    "MM/DD/YYYY h:mm:ss A" // Second format to try
  ];

  for (const format of formats) {
    const momentDate = moment.utc(dateString, format);
    if (momentDate.isValid()) {
      return momentDate.format('MMMM DD, YYYY hh:mm a');
    }
  }

  return 'Invalid date'; // Return default value if parsing fails for all formats
};

const Formatters = {
  FormatDate
}

export default Formatters;