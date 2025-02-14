// FundoDiploma.jsx

import './FundoDiploma.css';

const FundoDiploma = () => {

  return (
    <div className="diploma-container">
      <div className="page-border"></div>

      <div className="diploma-content">
        {/* Seção Superior */}
        <section className="curso-info">
          <div className="info-row-top">
            <span className="label">CURSO ANTERIOR:</span>
            <span className="value">ENSINO MÉDIO</span>
            <span className="label">ANO DE CONCLUSÃO:</span>
            <span className="value"></span>
          </div>
          <div className="info-row-bottom">
            <span className="label">ESTABELECIMENTO:</span>
            <span className="value"></span>
            <span className="label-local">LOCAL:</span>
            <span className="value"></span>
          </div>
        </section>

        <section className="curso-atual">
          <div className="info-row">
            <span className="label">CURSO:</span>
            <span className="value">Educação Profissional Técnica de Nível Médio em Enfermagem</span>
          </div>
          <div className="info-row">
            <span className="label">Eixo Tecnológico:</span>
            <span className="value">Ambiente, Saúde e Segurança</span>
          </div>
          <div className="dates-row">
            <div className="info-row">
              <span className="label">INICIO DO CURSO:</span>
              <span className="value"></span>
            </div>
            <div className="info-row">
              <span className="label">TERMINO:</span>
              <span className="value"></span>
            </div>
          </div>
        </section>

        {/* Perfil e Competências */}
        <section className="perfil-section">
          <p className="section-title">PERFIL PROFISSIONAL DO TÉCNICO DE ENFERMAGEM: </p>
          <span className="section-text"> Prestar cuidados de enfermagem a individuo e população com a prerrogativa legal
            de assistir ao Enfermeiro nos diferentes níveis de atenção a saúde, em especial junto a pacientes graves e/ou
            com demandas especiais e no planejamento, programação orientação
            e supervisão das atividades de assistência, com integrante da equipe.</span>

        </section>
        <section className="competencia-section">
          <div className="section-title">COMPETÊNCIA ESPECÍFICA DO TÉCNICO DE ENFERMAGEM: </div>
          <p className="section-text"> Participar do planejamento, programação e orientação das atividades de assistência de enfermagem; Desempenhar ações de enfermagem inclusive a paciente em estado grave nos níveis de promoção,
            proteção, recuperação e de reabilitação da saúde do individuo e/ ou grupos sociais, excetuando-se aos cuidados requeridos por pacientes com risco de vida; Participar da prevenção e controle sistemático da infecção hospitalar; Atuar nos programas de higiene e
            segurança no trabalho; Participar da implementação de programa de vigilância a saúde; Desenvolver atividades de educação e comunicação em saúde; participar de programas / projetos de pesqu isa; Conhecer e aplicar princípios éticos profissionais, forma de
            conduta, noções básicas sobre o Código de Deontologia de Enfermagem, informações sobre o Órgão de Classe, ler e interpretar os dispositivos legais que orientam a formação do exercício profissional na enfermagem; Prestar assistência integral a binômia mãe
            filho durante o pré-natal, parto e puerpério e orientar quanto a importância do aleitamento materno. Conhecer as diversas fases do crescimento e desenvolvimento da criança, suas característica as reações da criança frente a hospitalização e atender para a
            amenização dos conflitos. Conhecer as ações do saneamento básico e sua importância na prevenção das doenças transmissíveis. Conhecer os transtornos mentais, formas de tratamento, cuidados e seguranças nas intercorrências psiquiátricas desfazendo
            preconceitos e favorecendo a integração social do doente.</p>
        </section>

        {/* Tabelas de Módulos */}
        {/* Tabelas de Módulos */}
        <section className="modulos-section">
          <table className="modulo-table">
            <tbody>
              {/* Módulo I */}
              <tr className="header-row">
                <td >Módulo I</td>
                <td>Carga Horária / Semestral</td>
                <td className='no-border'>Autenticação da Escola</td>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Anatomia e Fisiologia Humanas</td></tr>
                      <tr><td>Microbiologia e Parasitologia</td></tr>
                      <tr><td>Higiene e Profilaxia</td></tr>
                      <tr><td>Nutrição e Dietética</td></tr>
                      <tr><td>Psicologia Aplicada e Ética Profissional</td></tr>
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      <tr>
                        <td>100</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>80</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>50</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>50</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>50</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className="subtotal-row">
                        <td>330</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td rowSpan="8" className="autenticacao-cell">
                  <div className="linha-assinatura"></div>
                  <p>Autenticação da Escola</p>
                  <p className="codigo">CM CS:58/2018BA</p>
                  <p>Campo Reservado ao COREN</p>
                </td>
              </tr>

              {/* Módulo II */}
              <tr>
                <th>Módulo II</th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Farmacologia</td></tr>
                      <tr><td>Introdução a Enfermagem</td></tr>
                      <tr><td>Noções de Administração na Unidade de Enfermagem</td></tr>
                      <tr><td>Biossegurança</td></tr>
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      <tr>
                        <td>60</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>100</td>
                        <td></td>
                        <td>100</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>50</td>
                        <td></td>
                        <td>40</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>50</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className="subtotal-row">
                        <td>260</td>
                        <td></td>
                        <td>140</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Módulo III */}
              <tr>
                <th>
                  Módulo III
                </th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Enfermagem nas Emergências</td></tr>
                      <tr><td>Enfermagem em Clínica Médica</td></tr>
                      <tr><td>Enfermagem em Clínica Cirúrgica</td></tr>
                      <tr><td>Enfermagem Materno Infantil</td></tr>
                      <tr><td className="subtotal-row">Sub - Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      <tr>
                        <td>70</td>
                        <td></td>
                        <td>70</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>100</td>
                        <td></td>
                        <td>100</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>60</td>
                        <td></td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>70</td>
                        <td></td>
                        <td>50</td>
                        <td></td>
                      </tr>
                      <tr className="subtotal-row">
                        <td>300</td>
                        <td></td>
                        <td>220</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Módulo IV */}
              <tr>
                <th>
                  Módulo IV
                </th>
              </tr>
              <tr>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Componentes Curriculares</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Enfermagem Pediátrica</td></tr>
                      <tr><td>Enfermagem em Saúde Publica</td></tr>
                      <tr><td>Enfermagem em Saúde Mental</td></tr>
                      <tr><td>Enfermagem em Geriatria</td></tr>
                      <tr><td className="subtotal-row">Sub-Total</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Teoria/ Prática</th>
                        <th>Notas</th>
                        <th>Estágio</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody className='body-flex'>
                      <tr>
                        <td>70</td>
                        <td></td>
                        <td>50</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>100</td>
                        <td></td>
                        <td>90</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>70</td>
                        <td></td>
                        <td>50</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>70</td>
                        <td></td>
                        <td>50</td>
                        <td></td>
                      </tr>
                      <tr className="subtotal-row">
                        <td>310</td>
                        <td></td>
                        <td>240</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* Total Geral */}
              <tr>
                <td>
                  <table className="inner-table">
                    <tbody>
                      <tr><td className="total-row">Total Geral</td></tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="inner-table">
                    <tbody>
                      <tr className="total-row">
                        <td>1200</td>
                        <td></td>
                        <td>600</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div >
  );
};

export default FundoDiploma;