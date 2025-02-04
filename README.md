

<details>
<summary>&nbsp<b>텍스트 메쉬 렌더링 최적화 히스토리 📜</b> </summary>
    
### 📍 렌더링 최적화 단계

#### 최적화 적용 전
메쉬를 매번 새로 업데이트하는 방식으로, 성능이 최적화되지 않은 상태였습니다.

#### 1차 개선
첫 번째 최적화 단계에서는 메쉬의 형태(geometry)만 변경하여 성능을 개선했습니다.

#### 2차 개선
두 번째 최적화에서는 요소들을 업데이트하지 않도록 처리하여, 렌더링 성능을 더욱 향상시켰습니다.

---

### 📍 단계별 영상 비교
<div style="display: flex; justify-content: space-around;">
    <img src="https://github.com/user-attachments/assets/29b42fcd-45a1-478d-a2e1-4c0581fd1383" width="30%" />
    <img src="https://github.com/user-attachments/assets/a0fe0eb2-aa84-4c85-84b9-ed98f945dc65" width="30%" />
    <img src="https://github.com/user-attachments/assets/a4f7e9d2-222a-4d51-922f-de5631393232" width="30%" />
</div>

---

### 📍 목적 및 결과
초 단위로 렌더링할 때는 큰 불안정성이 없었지만, 밀리초 단위로 렌더링하려니 화면이 심하게 불안정해졌습니다. <br>
이를 개선하기 위해 최적화를 시도했습니다.

처음에는 `mesh`를 새로 업데이트하지 않고, `geometry`만 업데이트하는 방식이 성능 향상에 큰 영향을 줄 것이라 예상했습니다. <br>
그러나 영상에서 보듯, 기대했던 만큼의 변화는 없었습니다.

반면, 텍스트 위치 계산과 같은 고정된 설정 값들이 매번 업데이트되지 않도록 제외하는 방식이 성능을 크게 향상시켰습니다.

---

### 📍 피드백
코드를 작성할 때 엣지 케이스를 고려한 테스트와 개발에 집중하는 습관을 기르는 것이 중요하다고 느꼈습니다.<br>
이러한 습관이 불필요하게 단계별 최적화를 시도하는 과정을 줄이고, 자연스럽게 좋은 코드를 작성할 수 있도록 도와줄 것이라고 생각합니다.
</details>

<details>
<summary> &nbsp<b>자동차 주행제어 및 충돌처리 구현영상 🚗</b> </summary>

#### 방향키를 활용한 자동차 주행제어
https://github.com/user-attachments/assets/0785e7d8-093b-4881-b09f-ca787f484cd4

#### Blender 내 모든 객체들에 대한 충돌 처리
https://github.com/user-attachments/assets/8f0e1c77-c14f-4fe1-84f3-028d220eef2c
</details>    


<details>
<summary>&nbsp<b>직접 구현한 바닥과 벽에서 충돌처리 구현 🚙</b> </summary>
    
https://github.com/user-attachments/assets/ba1b5a39-0516-4ea4-8d51-946e9bbc9838

</details> 

