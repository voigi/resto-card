import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";

// ----- REGISTER FONTS -----
Font.register({
  family: "DancingScript",
  src: "/fonts/DancingScript-Regular.ttf",
});
Font.register({
  family: "DancingScript-Bold",
  src: "/fonts/DancingScript-Bold.ttf",
});

// ----- COMPONENT -----
const MenuPdf = ({ menu, theme, establishmentName }) => {
  if (!theme) {
    console.error("Theme PDF undefined");
    return <Document><Page><Text>Theme non défini</Text></Page></Document>;
  }

  const THEME = {
    COLORS: {
      background: theme.pdf.bg || "#fff",
      textPrimary: theme.pdf.colorHeading || "#000",
      textSecondary: theme.colors?.["--text-light"] || "#555",
      accent: theme.pdf.colorAccent || "#000",
      border: theme.colors?.["--border"] || "#ccc",
      footer: theme.colors?.["--text-light"] || "#555",
      cardBg: "#ffffff",
      shadowColor: "rgba(0, 0, 0, 0.05)",
    },
    FONTS: {
      heading: theme.pdf.fontHeading || "Helvetica-Bold",
      body: theme.pdf.fontBody || "Helvetica",
      bodyBold: theme.pdf.fontBody === "Times-Roman" ? "Times-Bold" : "Helvetica-Bold",
      bodyItalic: theme.pdf.fontBody === "Times-Roman" ? "Times-Italic" : "Helvetica-Oblique",
    },
    SPACING: {
      pagePadding: 40,
      headerMarginBottom: 25,
      logoMarginBottom: 8,
      sectionMarginBottom: 20,
      sectionTitleMarginBottom: 12,
      itemMarginBottom: 10,
      itemPadding: 10,
      footerMarginTop: 30,
    },
  };

  // Configuration spécifique par thème
  const themeConfig = {
    tea: {
      // Salon de thé : doux, élégant, vintage
      logoSize: 80,
      logoBorderRadius: 40,
      logoBorderWidth: 3,
      titleSize: 38,
      titleLetterSpacing: 2,
      sectionStyle: "ornamental", // ornamental, badge, minimal
      itemCardStyle: "vintage", // vintage, modern, sport
      priceStyle: "tag", // tag, inline, badge
      decorativeElements: true,
      imageShape: "round", // round, square
    },
    restaurant: {
      // Restaurant : classique, raffiné, sobre
      logoSize: 70,
      logoBorderRadius: 8,
      logoBorderWidth: 2,
      titleSize: 40,
      titleLetterSpacing: 2.5,
      sectionStyle: "minimal",
      itemCardStyle: "modern",
      priceStyle: "inline",
      decorativeElements: false,
      imageShape: "square",
    },
    sport: {
      // Sport : dynamique, énergique, moderne
      logoSize: 65,
      logoBorderRadius: 32.5,
      logoBorderWidth: 4,
      titleSize: 36,
      titleLetterSpacing: 1.5,
      sectionStyle: "badge",
      itemCardStyle: "sport",
      priceStyle: "badge",
      decorativeElements: true,
      imageShape: "round",
    },
    association: {
      // Association : communautaire, clair, structuré
      logoSize: 70,
      logoBorderRadius: 10,
      logoBorderWidth: 2,
      titleSize: 36,
      titleLetterSpacing: 1,
      sectionStyle: "badge",
      itemCardStyle: "modern",
      priceStyle: "tag",
      decorativeElements: true,
      imageShape: "round",
    },
  };

  const config = themeConfig[theme.id] || themeConfig.tea;

  const styles = StyleSheet.create({
    page: {
      padding: THEME.SPACING.pagePadding,
      fontSize: 11,
      fontFamily: THEME.FONTS.body,
      backgroundColor: THEME.COLORS.background,
      color: THEME.COLORS.textPrimary,
      position: "relative",
    },
    
    pageBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: theme.pdf.backgroundOpacity || 0.06,
      objectFit: "cover",
    },

    // Header - adapté au thème
    header: {
      textAlign: "center",
      marginBottom: THEME.SPACING.headerMarginBottom,
      paddingBottom: theme.id === "restaurant" ? 20 : 15,
      borderBottomWidth: theme.id === "restaurant" ? 1 : 2,
      borderBottomColor: theme.id === "restaurant" ? THEME.COLORS.border : THEME.COLORS.accent,
      borderBottomStyle: "solid",
    },
    
    logoContainer: {
      alignItems: "center",
      marginBottom: THEME.SPACING.logoMarginBottom,
    },
    
    logo: {
      width: config.logoSize,
      height: config.logoSize,
      marginBottom: 8,
      borderRadius: config.logoBorderRadius,
      border: `${config.logoBorderWidth}px solid ${THEME.COLORS.accent}`,
    },
    
    title: {
      fontSize: config.titleSize,
      fontFamily: THEME.FONTS.heading,
      color: THEME.COLORS.textPrimary,
      letterSpacing: config.titleLetterSpacing,
      marginBottom: 4,
    },
    
    subtitle: {
      fontSize: theme.id === "restaurant" ? 14 : 13,
      fontFamily: THEME.FONTS.bodyItalic,
      color: THEME.COLORS.accent,
      marginTop: 6,
      letterSpacing: 0.5,
    },

    // Éléments décoratifs (Tea & Sport)
    decorativeLine: {
      width: theme.id === "tea" ? 100 : 60,
      height: theme.id === "tea" ? 2 : 4,
      backgroundColor: THEME.COLORS.accent,
      alignSelf: "center",
      marginTop: 8,
      borderRadius: 2,
    },

    decorativeDots: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginTop: 10,
    },

    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: THEME.COLORS.accent,
    },

    // Section - 3 styles différents
    section: {
      marginBottom: THEME.SPACING.sectionMarginBottom,
    },
    
    // Style "ornamental" (Tea)
    sectionTitleOrnamental: {
      textAlign: "center",
      marginBottom: THEME.SPACING.sectionTitleMarginBottom,
      position: "relative",
    },

    sectionTitleOrnamentalText: {
      fontSize: 18,
      fontFamily: THEME.FONTS.heading,
      color: THEME.COLORS.accent,
      letterSpacing: 1.5,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: THEME.COLORS.accent,
    },

    // Style "badge" (Sport)
    sectionTitleBadge: {
      backgroundColor: THEME.COLORS.accent,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginBottom: THEME.SPACING.sectionTitleMarginBottom,
      borderRadius: 25,
      alignSelf: "flex-start",
    },
    
    sectionTitleBadgeText: {
      fontSize: 15,
      fontFamily: THEME.FONTS.bodyBold,
      color: "#ffffff",
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },

    // Style "minimal" (Restaurant)
    sectionTitleMinimal: {
      marginBottom: THEME.SPACING.sectionTitleMarginBottom,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: THEME.COLORS.accent,
    },
    
    sectionTitleMinimalText: {
      fontSize: 20,
      fontFamily: THEME.FONTS.heading,
      color: THEME.COLORS.textPrimary,
      letterSpacing: 2,
      textTransform: "uppercase",
    },

    // Item cards - 3 styles différents
    // Style "vintage" (Tea)
    itemCardVintage: {
      backgroundColor: THEME.COLORS.cardBg,
      borderRadius: 12,
      marginBottom: THEME.SPACING.itemMarginBottom,
      padding: 12,
      borderWidth: 1.5,
      borderColor: THEME.COLORS.border,
      borderStyle: "dashed",
      shadowColor: THEME.COLORS.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },

    // Style "modern" (Restaurant)
    itemCardModern: {
      backgroundColor: THEME.COLORS.cardBg,
      marginBottom: THEME.SPACING.itemMarginBottom,
      padding: 15,
      borderLeftWidth: 3,
      borderLeftColor: THEME.COLORS.accent,
      borderLeftStyle: "solid",
    },

    // Style "sport" (Sport)
    itemCardSport: {
      backgroundColor: THEME.COLORS.cardBg,
      borderRadius: 8,
      marginBottom: THEME.SPACING.itemMarginBottom,
      padding: 12,
      borderWidth: 2,
      borderColor: THEME.COLORS.accent,
      borderStyle: "solid",
      shadowColor: THEME.COLORS.shadowColor,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    
    itemContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    
    // Images - round ou square
    itemImageRound: {
      width: 55,
      height: 55,
      borderRadius: 27.5,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: THEME.COLORS.border,
      borderStyle: "solid",
    },

    itemImageSquare: {
      width: 55,
      height: 55,
      borderRadius: 4,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: THEME.COLORS.border,
      borderStyle: "solid",
    },
    
    itemImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    
    itemContent: {
      flex: 1,
      paddingRight: 5,
    },
    
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
      gap: 10,
    },
    
    itemName: {
      fontSize: 13,
      fontFamily: THEME.FONTS.bodyBold,
      color: THEME.COLORS.textPrimary,
      flex: 1,
      lineHeight: 1.3,
    },
    
    // Prix style "tag" (Tea)
    itemPriceTag: {
      backgroundColor: THEME.COLORS.accent,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 15,
      minWidth: 60,
      alignItems: "center",
    },

    // Prix style "badge" (Sport)
    itemPriceBadge: {
      backgroundColor: THEME.COLORS.accent,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
      minWidth: 55,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#ffffff",
    },

    // Prix style "inline" (Restaurant)
    itemPriceInline: {
      minWidth: 55,
      alignItems: "flex-end",
    },
    
    itemPriceText: {
      fontSize: 12,
      fontFamily: THEME.FONTS.bodyBold,
      color: "#ffffff",
      letterSpacing: 0.3,
    },

    itemPriceInlineText: {
      fontSize: 14,
      fontFamily: THEME.FONTS.bodyBold,
      color: THEME.COLORS.accent,
      letterSpacing: 0.3,
    },
    
    itemDescription: {
      fontSize: 9.5,
      fontFamily: THEME.FONTS.body,
      color: THEME.COLORS.textSecondary,
      lineHeight: 1.4,
      marginTop: 3,
    },

    noItemsText: {
      fontSize: 10,
      fontFamily: THEME.FONTS.bodyItalic,
      color: THEME.COLORS.textSecondary,
      textAlign: "center",
      paddingVertical: 15,
    },

    // Footer
    footerContainer: {
      marginTop: THEME.SPACING.footerMarginTop,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: THEME.COLORS.border,
      borderTopStyle: theme.id === "tea" ? "dotted" : "solid",
    },
    
    footer: {
      textAlign: "center",
      fontSize: 9,
      color: THEME.COLORS.footer,
      fontFamily: THEME.FONTS.bodyItalic,
      lineHeight: 1.5,
    },
    
    footerBold: {
      fontFamily: THEME.FONTS.bodyBold,
      color: THEME.COLORS.accent,
    },

    pageNumber: {
      position: "absolute",
      bottom: 20,
      right: 40,
      fontSize: 9,
      color: THEME.COLORS.textSecondary,
      fontFamily: THEME.FONTS.body,
    },
  });

  // Fonction pour obtenir le style de section selon le thème
  const getSectionTitleStyle = () => {
    switch (config.sectionStyle) {
      case "ornamental":
        return styles.sectionTitleOrnamental;
      case "badge":
        return styles.sectionTitleBadge;
      case "minimal":
        return styles.sectionTitleMinimal;
      default:
        return styles.sectionTitleMinimal;
    }
  };

  const getSectionTitleTextStyle = () => {
    switch (config.sectionStyle) {
      case "ornamental":
        return styles.sectionTitleOrnamentalText;
      case "badge":
        return styles.sectionTitleBadgeText;
      case "minimal":
        return styles.sectionTitleMinimalText;
      default:
        return styles.sectionTitleMinimalText;
    }
  };

  // Fonction pour obtenir le style de carte selon le thème
  const getItemCardStyle = () => {
    switch (config.itemCardStyle) {
      case "vintage":
        return styles.itemCardVintage;
      case "modern":
        return styles.itemCardModern;
      case "sport":
        return styles.itemCardSport;
      default:
        return styles.itemCardModern;
    }
  };

  // Fonction pour obtenir le style d'image selon le thème
  const getImageStyle = () => {
    return config.imageShape === "round" ? styles.itemImageRound : styles.itemImageSquare;
  };

  // Fonction pour rendre le prix selon le style
  const renderPrice = (price) => {
    const formattedPrice = parseFloat(price).toFixed(2);
    
    switch (config.priceStyle) {
      case "tag":
        return (
          <View style={styles.itemPriceTag}>
            <Text style={styles.itemPriceText}>{formattedPrice} €</Text>
          </View>
        );
      case "badge":
        return (
          <View style={styles.itemPriceBadge}>
            <Text style={styles.itemPriceText}>{formattedPrice} €</Text>
          </View>
        );
      case "inline":
        return (
          <View style={styles.itemPriceInline}>
            <Text style={styles.itemPriceInlineText}>{formattedPrice} €</Text>
          </View>
        );
      default:
        return (
          <View style={styles.itemPriceTag}>
            <Text style={styles.itemPriceText}>{formattedPrice} €</Text>
          </View>
        );
    }
  };

  // Group menu items by category
  const menuByCategory = theme.categories.reduce((acc, cat) => {
    acc[cat] = menu.filter((item) => item.categorie === cat);
    return acc;
  }, {});

  return (
    <Document
      title={`${establishmentName} - Menu`}
      author={establishmentName}
      subject="Menu professionnel"
      creator="Menu Creator App"
    >
      <Page size="A4" style={styles.page}>
        {/* Background image */}
        {theme.pdf.backgroundImage && (
          <Image 
            src={theme.pdf.backgroundImage} 
            style={styles.pageBackground} 
            fixed 
          />
        )}

        {/* HEADER */}
        <View style={styles.header} fixed>
          <View style={styles.logoContainer}>
            {theme.pdf.logo && (
              <Image src={theme.pdf.logo} style={styles.logo} />
            )}
          </View>
          <Text style={styles.title}>{establishmentName}</Text>
          <Text style={styles.subtitle}>{theme.labels.subtitle}</Text>
          
          {/* Éléments décoratifs selon le thème */}
          {config.decorativeElements && (
            <>
              <View style={styles.decorativeLine} />
              {theme.id === "tea" && (
                <View style={styles.decorativeDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              )}
            </>
          )}
        </View>

        {/* MENU SECTIONS */}
        {theme.categories.map((cat) => {
          const items = menuByCategory[cat] || [];
          
          if (items.length === 0) return null;

          return (
            <View key={cat} style={styles.section} wrap={false}>
              <View style={getSectionTitleStyle()}>
                <Text style={getSectionTitleTextStyle()}>{cat}</Text>
              </View>
              
              {items.map((item) => (
                <View key={item.id} style={getItemCardStyle()} wrap={false}>
                  <View style={styles.itemContainer}>
                    {item.image && (
                      <View style={getImageStyle()}>
                        <Image src={item.image} style={styles.itemImage} />
                      </View>
                    )}
                    
                    <View style={styles.itemContent}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemName}>{item.nom}</Text>
                        {renderPrice(item.prix)}
                      </View>
                      
                      {item.description && (
                        <Text style={styles.itemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {/* Empty state */}
        {menu.length === 0 && (
          <View style={{ marginTop: 40 }}>
            <Text style={styles.noItemsText}>
              Aucun élément n'a encore été ajouté au menu.
            </Text>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footer}>
            <Text style={styles.footerBold}>{establishmentName}</Text>
            {"\n"}
            Créé avec passion • {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Page number */}
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => 
            `Page ${pageNumber} / ${totalPages}`
          } 
          fixed 
        />
      </Page>
    </Document>
  );
};

export default MenuPdf;