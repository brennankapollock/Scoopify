export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  const header = document.querySelector('nav');
  
  if (section && header) {
    const headerHeight = header.getBoundingClientRect().height;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: sectionTop - headerHeight,
      behavior: 'smooth'
    });
  }
};