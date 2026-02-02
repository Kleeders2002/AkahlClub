// Archivo actualizado: ComparativePage.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, FileText, Clock, Award, Download, Users, Video, Gift, Calendar, MessageCircle, Headphones, BadgeCheck } from 'lucide-react';

const ComparativePage = () => {
  const { t } = useTranslation();
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadEbook = () => {
    const ebookUrl = '/ebooks/akahl-club-primavera.pdf';
    const link = document.createElement('a');
    link.href = ebookUrl;
    link.download = 'Akahl-Club-Guia-Primavera.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const silverFeatures = [
    t('comparative.features.silver1', 'Acceso al grupo principal de WhatsApp (Grupo Plata)'),
    t('comparative.features.silver2', 'Newsletter mensual con tips de estilo'),
    t('comparative.features.silver3', 'Consejos semanales de combinación'),
    t('comparative.features.silver4', 'Acceso a algunos eventos virtuales selectos'),
    t('comparative.features.silver5', '5% de descuento en primera compra'),
    t('comparative.features.silver6', 'Guía básica de estilo personal'),
    t('comparative.features.silver7', 'Comunidad de apoyo y networking básico'),
    t('comparative.features.silver8', 'Contenido exclusivo en redes sociales')
  ];

  const goldFeatures = [
    t('comparative.features.gold1', 'Todo lo del plan Plata'),
    t('comparative.features.gold2', 'Acceso exclusivo al grupo VIP de WhatsApp (Grupo Oro)'),
    t('comparative.features.gold3', 'Biblioteca digital completa: acceso a todos los ebooks'),
    t('comparative.features.gold4', 'Tutoriales en video exclusivos (contenido avanzado)'),
    t('comparative.features.gold5', 'Consultas de estilo personalizadas ocasionales'),
    t('comparative.features.gold6', '15% de descuento permanente en prendas específicas'),
    t('comparative.features.gold7', 'Acceso anticipado a nuevas colecciones'),
    t('comparative.features.gold8', 'Invitaciones a eventos presenciales selectos'),
    t('comparative.features.gold9', 'Guía de inversión en prendas de calidad'),
    t('comparative.features.gold10', 'Asesoría de combinaciones personalizadas'),
    t('comparative.features.gold11', 'Certificado digital de membresía premium')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1812] to-[#152821]">
      <section className="relative overflow-hidden py-20 px-4 md:px-5% lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(21,40,33,0.4)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(196,185,152,0.1)_0%,transparent_50%)]"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 text-center lg:mb-20">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#c4b998]/30 bg-white/10 px-6 py-3 font-playfair text-sm font-bold uppercase tracking-[0.2em] text-[#c4b998] backdrop-blur-lg lg:px-9 lg:py-4 lg:text-base">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c4b998]"></div>
              <span>{t('comparative.badge', 'COMPARACIÓN DETALLADA')}</span>
            </div>
            
            <h1 className="mb-8 font-cormorant text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
              {t('comparative.title', 'Comparación Completa de Planes')}
            </h1>
            
            <p className="mx-auto max-w-4xl font-montserrat text-xl leading-relaxed text-white/80 lg:text-2xl">
              {t('comparative.subtitle', 'Explora en detalle cada beneficio, descarga nuestra guía de primavera y elige el plan perfecto para tu evolución de estilo.')}
            </p>
          </div>

          <div className="mx-auto mb-24 max-w-6xl lg:mb-32">
            <div className="rounded-3xl border border-[#c4b998]/30 bg-gradient-to-br from-[#152821] via-[#1a3028] to-[#152821] p-8 shadow-2xl lg:p-12">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c4b998]/20 to-[#c4b998]/10 text-3xl text-[#c4b998]">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="font-cormorant text-2xl font-semibold text-white lg:text-3xl">
                        {t('comparative.ebook.title', 'Guía de Primavera Gratuita')}
                      </h2>
                      <p className="mt-2 font-montserrat text-white/70">
                        {t('comparative.ebook.subtitle', 'Descarga nuestra guía completa para vestir con estilo durante la primavera')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#c4b998]/20 text-sm text-[#c4b998]">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-montserrat font-semibold text-white">
                          {t('comparative.ebook.chapter1', 'Capítulo 1: Transición de Temporada')}
                        </h4>
                        <p className="font-montserrat text-sm text-white/60">
                          {t('comparative.ebook.chapter1_desc', 'Cómo adaptar tu armario del invierno a la primavera')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#c4b998]/20 text-sm text-[#c4b998]">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-montserrat font-semibold text-white">
                          {t('comparative.ebook.chapter2', 'Capítulo 2: Paleta de Colores Primaveral')}
                        </h4>
                        <p className="font-montserrat text-sm text-white/60">
                          {t('comparative.ebook.chapter2_desc', 'Colores que brillan en primavera y cómo combinarlos')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#c4b998]/20 text-sm text-[#c4b998]">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-montserrat font-semibold text-white">
                          {t('comparative.ebook.chapter3', 'Capítulo 3: Prendas Esenciales')}
                        </h4>
                        <p className="font-montserrat text-sm text-white/60">
                          {t('comparative.ebook.chapter3_desc', 'Las 10 prendas imprescindibles para esta temporada')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#c4b998]/20 text-sm text-[#c4b998]">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="mb-1 font-montserrat font-semibold text-white">
                          {t('comparative.ebook.exercises', 'Ejercicios Prácticos')}
                        </h4>
                        <p className="font-montserrat text-sm text-white/60">
                          {t('comparative.ebook.exercises_desc', 'Actividades para renovar tu estilo esta primavera')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 text-white/60">
                      <FileText className="h-5 w-5 text-[#c4b998]" />
                      <span className="font-montserrat text-sm">{t('comparative.ebook.format', 'PDF • 4.1 MB')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                      <Clock className="h-5 w-5 text-[#c4b998]" />
                      <span className="font-montserrat text-sm">{t('comparative.ebook.reading_time', '60 minutos de lectura')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                      <Award className="h-5 w-5 text-[#c4b998]" />
                      <span className="font-montserrat text-sm">{t('comparative.ebook.level', 'Nivel: Principiante/Intermedio')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="mx-auto flex h-96 max-w-xs flex-col items-center justify-center rounded-2xl border border-[#c4b998]/30 bg-gradient-to-br from-[#c4b998]/10 to-transparent p-8 shadow-2xl">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-[#c4b998] opacity-20 blur-2xl"></div>
                        <BookOpen className="relative h-20 w-20 text-[#c4b998]" />
                      </div>
                      <h3 className="mb-4 font-cormorant text-2xl font-semibold text-white">
                        {t('comparative.ebook.name', 'Guía de Estilo Primaveral')}
                      </h3>
                      <p className="mb-6 font-montserrat text-sm text-white/70">
                        {t('comparative.ebook.edition', 'Edición especial de temporada')}
                      </p>
                      <div className="mx-auto h-1 w-32 bg-gradient-to-r from-transparent via-[#c4b998] to-transparent"></div>
                    </div>
                    
                    <button
                      onClick={handleDownloadEbook}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="group relative mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#c4b998] to-[#b8a988] px-6 py-5 font-montserrat font-bold uppercase tracking-wider text-[#152821] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className={`absolute inset-0 bg-white transition-opacity duration-300 ${isHovered ? 'opacity-20' : 'opacity-0'}`}></div>
                      <Download className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-y-1' : ''}`} />
                      <span className="relative">{t('comparative.ebook.download', 'Descargar Guía Gratis')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#152821] to-[#0f241d] py-20 px-4 md:px-5% lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center lg:mb-24">
            <h2 className="mb-8 font-cormorant text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
              {t('comparative.table_title', 'Comparación Lado a Lado')}
            </h2>
            <p className="mx-auto max-w-3xl font-montserrat text-xl text-white/70">
              {t('comparative.table_subtitle', 'Revisa cada característica en detalle para tomar la mejor decisión')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-8 text-left font-montserrat font-bold uppercase tracking-wider text-white/90">
                    {t('comparative.features', 'Características')}
                  </th>
                  <th className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 font-cormorant text-2xl font-semibold text-white/70">
                        {t('comparative.plan_silver', 'Plan Plata')}
                      </div>
                      <div className="font-montserrat text-3xl font-bold text-white">
                        ${t('membership.silver.price', '9.99')}
                      </div>
                      <div className="mt-1 font-montserrat text-sm text-white/60">
                        {t('membership.silver.period', 'Por mes')}
                      </div>
                    </div>
                  </th>
                  <th className="bg-gradient-to-b from-[#c4b998]/10 to-transparent px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-2 font-cormorant text-2xl font-semibold text-[#c4b998]">
                        {t('comparative.plan_gold', 'Plan Oro')}
                      </div>
                      <div className="font-montserrat text-3xl font-bold text-[#c4b998]">
                        ${t('membership.gold.price', '19.99')}
                      </div>
                      <div className="mt-1 font-montserrat text-sm text-white/60">
                        {t('membership.gold.period', 'Por mes')}
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Comunidad */}
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan="3" className="px-6 py-6">
                    <h3 className="flex items-center gap-3 font-cormorant text-xl font-semibold text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      {t('comparative.category_community', 'Comunidad y Grupos')}
                    </h3>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_whatsapp', 'Grupo de WhatsApp')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_whatsapp', 'Acceso al grupo Plata')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_whatsapp', 'Acceso exclusivo al grupo Oro')}
                  </td>
                </tr>

                {/* Contenido Educativo */}
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan="3" className="px-6 py-6">
                    <h3 className="flex items-center gap-3 font-cormorant text-xl font-semibold text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      {t('comparative.category_content', 'Contenido Exclusivo')}
                    </h3>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_ebooks', 'E-books digitales')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_ebooks', 'Acceso limitado')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_ebooks', 'Acceso completo a toda la biblioteca')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_tutorials', 'Tutoriales en video')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_tutorials', 'Contenido básico seleccionado')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_tutorials', 'Tutoriales avanzados exclusivos')}
                  </td>
                </tr>

                {/* Beneficios y Descuentos */}
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan="3" className="px-6 py-6">
                    <h3 className="flex items-center gap-3 font-cormorant text-xl font-semibold text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      {t('comparative.category_benefits', 'Beneficios Exclusivos')}
                    </h3>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_discounts', 'Descuentos en prendas')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_discounts', '5% primera compra')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_discounts', '15% permanente en prendas específicas')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_certificate', 'Certificado digital')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    —
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_certificate', 'Certificado de membresía premium')}
                  </td>
                </tr>

                {/* Eventos y Experiencias */}
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan="3" className="px-6 py-6">
                    <h3 className="flex items-center gap-3 font-cormorant text-xl font-semibold text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      {t('comparative.category_events', 'Eventos y Experiencias')}
                    </h3>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_virtual_events', 'Eventos virtuales')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_virtual_events', 'Algunos eventos selectos')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_virtual_events', 'Todos los eventos online')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_presential_events', 'Eventos presenciales')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    —
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_presential_events', 'Invitaciones a eventos selectos')}
                  </td>
                </tr>

                {/* Soporte y Asesoría */}
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan="3" className="px-6 py-6">
                    <h3 className="flex items-center gap-3 font-cormorant text-xl font-semibold text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Headphones className="h-4 w-4 text-white" />
                      </div>
                      {t('comparative.category_support', 'Soporte y Asesoría')}
                    </h3>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_consultation', 'Asesoría personal')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    —
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_consultation', 'Consultas de estilo ocasionales')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-5 font-montserrat text-white/90">
                    {t('comparative.feature_support', 'Soporte y respuestas')}
                  </td>
                  <td className="px-6 py-5 text-center font-montserrat text-white/70">
                    {t('comparative.silver_support', 'Respuestas en horarios laborables')}
                  </td>
                  <td className="bg-gradient-to-b from-[#c4b998]/5 to-transparent px-6 py-5 text-center font-montserrat text-[#c4b998]">
                    {t('comparative.gold_support', 'Atención prioritaria')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-montserrat font-medium uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <span>{showAllFeatures ? t('comparative.show_less', 'Mostrar menos') : t('comparative.show_all', 'Ver todas las características')}</span>
              <span className={`transform transition-transform ${showAllFeatures ? 'rotate-90' : ''}`}>→</span>
            </button>
          </div>

          {showAllFeatures && (
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#152821] via-[#1a3028] to-[#152821] p-8">
                <h3 className="mb-6 text-center font-cormorant text-2xl font-semibold text-white">
                  {t('comparative.plan_silver_complete', 'Plan Plata Completo')}
                </h3>
                <ul className="space-y-4">
                  {silverFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white">
                        {index + 1}
                      </div>
                      <span className="font-montserrat text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="rounded-3xl border border-[#c4b998]/30 bg-gradient-to-br from-[#152821] via-[#1a3028] to-[#152821] p-8">
                <h3 className="mb-6 text-center font-cormorant text-2xl font-semibold text-[#c4b998]">
                  {t('comparative.plan_gold_complete', 'Plan Oro Completo')}
                </h3>
                <ul className="space-y-4">
                  {goldFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#c4b998]/20 text-sm text-[#c4b998]">
                        {index + 1}
                      </div>
                      <span className="font-montserrat text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN DE CONTRASTE - Tono crema como SectionTwo */}
      <section className="relative bg-gradient-to-br from-[#f9f7f0] via-[#fdfcf8] to-[#f5f3ea] py-16 md:py-24 lg:py-28 overflow-hidden">
        {/* Textura sutil de fondo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Elementos decorativos flotantes */}
        <div className="absolute top-10 left-5 w-48 h-48 md:w-72 md:h-72 bg-[#c4b998]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-5 w-64 h-64 md:w-96 md:h-96 bg-[#152821]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Línea decorativa superior */}
          <div className="flex items-center justify-center mb-12 md:mb-16">
            <div className="h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-[#c4b998]/30" />
            <div className="mx-4 md:mx-6 w-2 h-2 rounded-full bg-[#c4b998]" />
            <div className="h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-[#c4b998]/30" />
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Subtítulo con animación */}
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-1 md:-inset-2 bg-[#c4b998]/10 blur-xl rounded-lg" />
              <div className="relative text-[#152821] uppercase tracking-[3px] md:tracking-[4px] text-xs font-semibold px-4 py-2 md:px-6 md:py-3 border border-[#c4b998]/20 rounded-full backdrop-blur-sm bg-white/50">
                {t('comparative.highlight_section.badge', 'POR QUÉ ELEGIRNOS')}
              </div>
            </div>

            {/* Título principal */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-light text-[#152821] mb-6">
              {t('comparative.highlight_section.title', 'Más que una membresía,')}
              <br />
              <span
                className="font-serif italic text-[#c4b998] relative inline-block"
                style={{
                  textShadow: '0 0 40px rgba(196, 185, 152, 0.15)'
                }}
              >
                {t('comparative.highlight_section.highlight', 'una experiencia transformadora')}
                <svg
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 5 100 2 150 5C200 8 250 10 298 8"
                    stroke="#c4b998"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </h2>

            {/* Descripción */}
            <p className="text-base md:text-lg text-[#152821]/80 leading-relaxed max-w-2xl mx-auto font-light mb-12">
              {t('comparative.highlight_section.description', 'En Akahl Club no solo te ofrecemos beneficios, te guiamos en un viaje de transformación personal donde el estilo se convierte en tu firma distintiva.')}
            </p>

            {/* Línea divisoria */}
            <div className="w-12 md:w-16 h-px bg-gradient-to-r from-[#c4b998] to-transparent mx-auto mb-12"></div>

            {/* Grid de beneficios destacados */}
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* Beneficio 1 */}
              <div className="group p-6 rounded-xl bg-white/60 border border-[#c4b998]/10 hover:bg-white/90 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#c4b998]/20 group-hover:scale-110 transition-transform duration-500 shadow-md mb-4">
                    <BadgeCheck className="w-8 h-8 text-[#c4b998]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#152821] mb-2 group-hover:text-[#c4b998] transition-colors">
                    {t('comparative.highlight_section.card1_title', 'Expertos en Estilo')}
                  </h4>
                  <p className="text-[#152821]/70 font-light text-sm leading-relaxed">
                    {t('comparative.highlight_section.card1_desc', 'Más de 10 años transformando armarios y elevando estilos personales.')}
                  </p>
                </div>
              </div>

              {/* Beneficio 2 */}
              <div className="group p-6 rounded-xl bg-white/60 border border-[#c4b998]/10 hover:bg-white/90 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#c4b998]/20 group-hover:scale-110 transition-transform duration-500 shadow-md mb-4">
                    <Users className="w-8 h-8 text-[#c4b998]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#152821] mb-2 group-hover:text-[#c4b998] transition-colors">
                    {t('comparative.highlight_section.card2_title', 'Comunidad Activa')}
                  </h4>
                  <p className="text-[#152821]/70 font-light text-sm leading-relaxed">
                    {t('comparative.highlight_section.card2_desc', 'Miles de miembros compartiendo tips, combinaciones y experiencias.')}
                  </p>
                </div>
              </div>

              {/* Beneficio 3 */}
              <div className="group p-6 rounded-xl bg-white/60 border border-[#c4b998]/10 hover:bg-white/90 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-[#c4b998]/20 group-hover:scale-110 transition-transform duration-500 shadow-md mb-4">
                    <Gift className="w-8 h-8 text-[#c4b998]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#152821] mb-2 group-hover:text-[#c4b998] transition-colors">
                    {t('comparative.highlight_section.card3_title', 'Beneficios Reales')}
                  </h4>
                  <p className="text-[#152821]/70 font-light text-sm leading-relaxed">
                    {t('comparative.highlight_section.card3_desc', 'Descuentos, eventos exclusivos y contenido que transforma tu día a día.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-5% lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border border-[#c4b998]/30 bg-gradient-to-br from-[#152821] to-[#1a3028] p-12 shadow-2xl lg:p-16">
            <h2 className="mb-6 font-cormorant text-3xl font-semibold text-white lg:text-4xl">
              {t('comparative.cta_title', '¿Listo para Transformar Tu Estilo?')}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl font-montserrat text-xl text-white/80">
              {t('comparative.cta_subtitle', 'Únete a miles de personas que ya están mejorando su estilo de vida con Akahl Club. Elige el plan que mejor se adapte a tus necesidades.')}
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 px-10 py-5 font-montserrat font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl sm:w-auto">
                <span>{t('comparative.cta_button_silver', 'Comenzar Plan Plata')}</span>
                <span>→</span>
              </button>
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#c4b998] to-[#b8a988] px-10 py-5 font-montserrat font-bold uppercase tracking-wider text-[#152821] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl sm:w-auto">
                <span>{t('comparative.cta_button_gold', 'Probar Plan Oro')}</span>
                <span>→</span>
              </button>
            </div>
            <p className="mt-8 font-montserrat text-sm text-white/60">
              {t('comparative.cta_help', '¿Aún tienes dudas?')}{' '}
              <Link to="/contacto" className="text-[#c4b998] hover:underline">
                {t('comparative.contact_us', 'Contáctanos')}
              </Link>{' '}
              {t('comparative.cta_help_suffix', 'para una asesoría personalizada')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComparativePage;