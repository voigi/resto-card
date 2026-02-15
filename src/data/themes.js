export const themes = {
  sportive: {
    background: "#E6F0FA",
    font: "Roboto, sans-serif",
    cardBorder: "2px solid #007BFF",
    labels: { item: "Nom du sport", description: "Description du sport", price: "Prix" },
    categories: ["Football", "Basket", "Tennis"],
    icon: "sport-icon.png",
    pdf: {
      fontHeading: "Helvetica-Bold",
      fontBody: "Helvetica",
      colorHeading: "#007BFF",
      colorAccent: "#27ae60",
      bg: "#E6F0FA",
      logo: "https://cdn-icons-png.flaticon.com/512/2964/2964514.png",
      backgroundImage: "https://cdn-icons-png.flaticon.com/512/1046/1046766.png" // fond sport léger
    }
  },
  restaurant: {
    background: "#FFF3E6",
    font: "Georgia, serif",
    cardBorder: "2px solid #FF5733",
    labels: { item: "Plat", description: "Description du plat", price: "Prix" },
    categories: ["Entrée", "Plat", "Dessert"],
    icon: "restaurant-icon.png",
    pdf: {
      fontHeading: "Times-Roman",
      fontBody: "Times-Roman",
      colorHeading: "#FF5733",
      colorAccent: "#e74c3c",
      bg: "#FFF3E6",
      logo: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png",
      backgroundImage: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" // fond restaurant
    }
  },
  salonDeThe: {
    background: "#FDEFF2",
    font: "Cursive, sans-serif",
    cardBorder: "2px solid #C70039",
    labels: { item: "Boisson", description: "Description", price: "Prix" },
    categories: ["Thé", "Gâteau", "Snack"],
    icon: "the-icon.png",
    pdf: {
      fontHeading: "DancingScript",
      fontBody: "Helvetica",
      colorHeading: "#C70039",
      colorAccent: "#a1887f",
      bg: "#FDEFF2",
      logo: "https://cdn-icons-png.flaticon.com/512/5411/5411387.png",
      backgroundImage: "https://cdn-icons-png.flaticon.com/512/616/616408.png" // fond thé léger
    }
  },
};
