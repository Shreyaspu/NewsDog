import React  from 'react'

const Newsitem = (props) => {

    let { title = "", description = "", imageUrl = "", url = "", author = "Unknown", date = new Date().toISOString(), source = "Unknown Source" } = props;
    return (
      <div className="my-3">
        <div className="card bg-dark text-light">
          <div style = {{
            display:'flex',
            justifyContent:'flex-end',
            position:'absolute',
            right:'0'
          }}>

          <span className=" badge rounded-pill bg-danger" >{source}</span>
          </div>
          <img
            src={
              imageUrl
                ? imageUrl
                : "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/KHT6HJDKQUL7U4QLEBNZ36HQEA.JPG&w=1440"
            }
            className="card-img-top"
            alt="..."
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h5 className="card-title">
              {title ? title.slice(0, 45) : ""}
            </h5>
            <p className="card-text">{description ? description.slice(0, 88) : ""}</p>
            <p className="card-text">
              <small className="text-body-secondary text-danger">
                By {author} on{" "}
                {new Date(date).toGMTString()}{" "}
              </small>
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  
}

export default Newsitem;
