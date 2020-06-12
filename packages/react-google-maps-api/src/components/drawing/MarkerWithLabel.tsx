import React, {CSSProperties, ReactElement} from 'react'
import ReactDOM from 'react-dom'
import Marker, {MarkerProps, updaterMap} from "./Marker"
import markerWithLabelFactory from 'markerwithlabel'
import {HasMarkerAnchor} from "../../types";

export interface MarkerWithLabelProps extends MarkerProps {
  labelAnchor?: google.maps.Point
  labelClass?: string
  labelStyle?: CSSProperties
  labelVisible?: boolean
  labelContent: ReactElement
}

const markerWithLabelUpdaterMap = {
  labelAnchor(instance: google.maps.Marker, labelAnchor: google.maps.Point) {
    instance.set(`labelAnchor`, labelAnchor)
  },
  labelClass(instance: google.maps.Marker, labelClass: string) {
    instance.set(`labelClass`, labelClass)
  },
  labelStyle(instance: google.maps.Marker, labelStyle: CSSProperties) {
    instance.set(`labelStyle`, labelStyle)
  },
  labelVisible(instance: google.maps.Marker, labelVisible: boolean) {
    instance.set(`labelVisible`, labelVisible)
  },
  ...updaterMap
}


class CompMarkerWithLabel extends Marker<MarkerWithLabelProps> {

  containerElement: HTMLDivElement | null = null

  createMarker = (markerOptions: google.maps.MarkerOptions): google.maps.Marker => {
    const MarkerWithLabel = markerWithLabelFactory(google.maps)
    this.containerElement = document.createElement('div')
    const marker = new MarkerWithLabel(markerOptions)
    marker.set('labelContent', this.containerElement)
    return marker
  }

  createUpdaterMap = () => markerWithLabelUpdaterMap

  componentWillUnmount() {
    super.componentWillUnmount()
    this.containerElement = null
  }

  render() {
    const element = super.render()
    return (
      <>
        {element}
        {this.containerElement &&
        ReactDOM.createPortal(
          React.cloneElement(this.props.labelContent as React.ReactElement<HasMarkerAnchor>,
            { anchor: this.state.marker }),
          this.containerElement
        )}
      </>
    )
  }
}


export default CompMarkerWithLabel
