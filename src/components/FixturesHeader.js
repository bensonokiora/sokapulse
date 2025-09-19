export default function FixturesHeader() {
  return (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
        <span>&nbsp;Probability % </span><br />
        <span>1&nbsp;&nbsp;X&nbsp;&nbsp;2</span>
      </div>
      <div className="responsive-cell hide-on-mobile">Prediction</div>
      <div className="responsive-cell hide-on-mobile">Avg<br />goals</div>
      <div className="responsive-cell">Odds</div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );
}
