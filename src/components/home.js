import React from 'react';

const Home = () => {
    return ( <div>
               <section className="hero is-primary is-medium">
                 <div className="hero-body">
                   <div className="container has-text-centered">
                     <h1 className="title is-2">Яндекс Деньги</h1>
                     <h2 className="subtitle is-4">Работаем со всеми картами</h2>
                   </div>
                 </div>
               </section>
               <section className="section blog">
                 <div className="container">
                   <div className="columns is-mobile">
                     <div className="column is-8 is-offset-2">
                       <div className="content blog-post section">
                         <p className="has-text-right has-text-muted">опубликовано 2 дня назад</p>
                         <p>
                           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit massa eget mauris hendrerit, sit amet laoreet ex mattis. Aenean finibus massa eget finibus
                           faucibus. Etiam dolor lacus, imperdiet et nisl vitae, lacinia euismod arcu. Aliquam non sapien hendrerit nisi semper rhoncus a eget erat. Maecenas
                           accumsan semper ante eu molestie. Integer tristique erat sit amet posuere cursus. Aliquam placerat sit amet lectus laoreet vestibulum. Sed pharetra
                           neque ac libero ornare, nec viverra ante tristique. Mauris eget urna metus.
                         </p>
                         <p>
                           Aenean at dignissim lacus. Etiam id dolor mauris. Aenean mollis sollicitudin blandit. Nulla elementum, metus ut commodo gravida, diam ligula volutpat mauris, dignissim
                           lacinia eros ipsum sit amet dolor. Ut vestibulum sem nec luctus interdum. Integer ut efficitur nisl. Nam eu neque turpis.
                         </p>
                       </div>
                       <div className="card is-fullwidth">
                         <header className="card-header">
                           <p className="card-header-title">
                             Об авторе
                           </p>
                           <a className="card-header-icon" href="#top">
                             <i className="fa fa-angle-up"></i>
                           </a>
                         </header>
                         <div className="card-content">
                           <article className="media">
                             <div className="media-left">
                               <figure className="image is-64x64">
                                 <img src="http://placehold.it/128x128" alt="" />
                               </figure>
                             </div>
                             <div className="media-content">
                               <div className="content">
                                 <p>
                                   <strong>Kroniak</strong> <small>@kroniak</small>
                                   <br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                                 </p>
                               </div>
                             </div>
                           </article>
                         </div>
                         <footer className="card-footer">
                           <a className="card-footer-item">Share on Facebook</a>
                           <a className="card-footer-item">Share on Twitter</a>
                           <a className="card-footer-item">Share on G+</a>
                         </footer>
                       </div>
                     </div>
                   </div>
                 </div>
               </section>
             </div>
        );
};

export default Home;